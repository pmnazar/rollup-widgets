define(
    'i18n',
    [
        'app',
        'helpers/ajax/ajax-wrapper'
    ],
    function(App, Ajax) {
        $.i18n = {};
        $.i18n.dictionaries = {};

        var defaults = {
            name: 'ui-messages',
            language: '',
            path: '',
            callback: null,
            langManifest: null
        };

        if (typeof owPreparedData !== 'undefined' && 
            typeof owPreparedData.langManifest !== 'undefined') {
            defaults.langManifest = owPreparedData.langManifest;
        }

        $.i18n.properties = function(settings) {
            var currentFileName;
            var locale;

            settings = $.extend(defaults, settings);

            if (!settings.language) {
                settings.language = $.i18n.browserLang();
            }

            locale = typeof settings.language === 'string' ? settings.language.substring(0, 2): settings.language[0];
            $.i18n.currentLng = locale;

            if (settings.langManifest !== null) {
                currentFileName = settings.path + settings.langManifest[settings.name + '_' + locale + '.json'];
            }
            else {
                if (App.config.widgetType !== 'insight-desktop') {
                    currentFileName = settings.path + settings.name + '_' + locale + '.json';
                }
                else {
                    currentFileName = App.config.DOMAIN_URL + 'external/languages-dist/insight/' + settings.name + '_' + locale + '.json';   
                }
            }

            if ( currentFileName !== 'undefined' ) {
                $.when(getCurrentLanguage(currentFileName, settings.showLoader)).then(
                    function(currentLanguage) {
                        $.i18n.map = currentLanguage;
                        settings.callback();
                    },
                    function() {
                        console.log('something goes wrong');
                    }
                );
            }
            else {
                settings.callback();
            }
        };

        $.i18n.getDictionaries = function(settings) {
            settings = $.extend(true, {}, defaults, settings);

            if (!settings.language.length) {
                settings.language[0] = $.i18n.browserLang();
            }

            //var prevDictionaries = Object.keys($.i18n.dictionaries);
            var deferreds = [];
            var locale;
            var currentFileName;
            var promise;

            $.i18n.dictionaries[$.i18n.currentLng] = {};

            settings.language.forEach(function(item) {
                if ((Object.keys($.i18n.dictionaries).indexOf(item) >= 0 || item === App.locale) && settings.name === defaults.name) {
                    promise = createPromise();
                    return;
                }

                locale = item.substring(0, 2);

            if (settings.langManifest !== null) {
                currentFileName = settings.path + settings.langManifest[settings.name + '_' + locale + '.json'];
            }
            else {
                if (App.config.widgetType !== 'insight-desktop') {
                    currentFileName = settings.path + settings.name + '_' + locale + '.json';
                }
                else {
                    currentFileName = App.config.DOMAIN_URL + 'external/languages-dist/insight/' + settings.name + '_' + locale + '.json';   
                }
            }

                deferreds.push(getCurrentLanguage(currentFileName));
            });

            if (deferreds.length) {
                promise = $.when.apply($, deferreds).then(
                    function() {
                        var argumentsArr = Array.prototype.slice.call(arguments);

                        settings.language.forEach(function(locale, index) {
                            if (Object.prototype.toString.call(argumentsArr[0]) === '[object Array]') {
                                $.i18n.dictionaries[locale] = argumentsArr[index][0];
                            }
                            else {
                                $.i18n.dictionaries[locale] = argumentsArr[0];
                            }
                        });

                        return settings.callback();
                    },
                    function() {
                        console.log('something goes wrong');
                    }
                );
            }

            if (typeof promise === 'undefined') {
                promise = createPromise();
            }

            function createPromise() {
                return $.when(true).then(function() {
                    return settings.callback();
                });
            }

            return promise;
        };

        $.i18n.prop = function(key /* Add parameters as function arguments as necessary  */) {
            var methodArguments = arguments;
            var parsedStr;
            var value = $.i18n.map[key];

            if (value == null) {
                parsedStr = '[' + key + ']';
            }
            else if ("string" === typeof value) {
                parsedStr = value.replace(new RegExp('\{([0-9]+?)\}', "gm"), function(comparison, digit) {
                    var digit = parseInt(digit);

                    return (digit + 1 < methodArguments.length) ? methodArguments[digit + 1] : comparison;
                });
            }
            else {
                parsedStr = value;
            }

            return parsedStr;
        };

        /**
         * mProp
         * [locale] - string
         * [key] - string
         * [props] - array
         */
        $.i18n.mProp = function(locale, key, props) {
            var parsedStr,
                dictionary = $.i18n.dictionaries[locale],
                methodArguments = arguments;

            if (dictionary && dictionary[key]) {
                parsedStr = processProps(dictionary[key]);
            }
            else if ($.i18n.map[key]) {
                parsedStr = processProps($.i18n.map[key]);
            }
            else {
                parsedStr = '[' + key + ']';
            }

            function processProps(value) {
                var newValue = value;
                var regExp = new RegExp('\{([0-9]+?)\}', 'gm');

                if (typeof props !== 'undefined') {
                    newValue = value.replace(new RegExp('\{([0-9]+?)\}', "gm"), function(comparison, digit) {
                    var digit = parseInt(digit);

                    return (digit + 2 < methodArguments.length) ? methodArguments[digit + 2] : comparison;
                });
                }

                return newValue;
            }

            return parsedStr;
        };

        $.i18n.browserLang = function() {
            var locale = navigator.language || navigator.userLanguage;

            function normaliseLanguageCode(lang) {
                return lang.toLowerCase().substring(0, 2);
            }

            return normaliseLanguageCode(locale);
        };

        function getCurrentLanguage(filename, showLoader) {
            var deferreds = new $.Deferred();

            Ajax({
                url: filename,
                contentType: 'application/json',
                dataType: 'json',
                showLoader: showLoader === undefined ? true: showLoader,
                success: function(response) {
                    deferreds.resolve(response);
                },
                error: function() {
                    deferreds.reject();
                }
            });

            return deferreds;
        }

        return $;
    }
);