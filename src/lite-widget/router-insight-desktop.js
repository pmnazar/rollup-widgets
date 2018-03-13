try {
define('router-insight',
    [
        'app',
        'helpers/i18n'
    ],
    function(App) {
        var insightDesktopRouter = App.Router.defaultRouter.extend({
            routes: {
                '!/insight/:pollId/:widgetId' : 'insight',
                '!/insight/:pollId/:widgetId/:locale': 'insight',
                '!/:pollId/:widgetId' : 'insight',
                '!/:pollId/:widgetId/:locale': 'insight'
            },
            insight: function() {
                var urlArguments = Array.prototype.slice.call(arguments),
                    widgetCodeLengthLimit = 36,
                    widgetId = urlArguments[1].substr(0, widgetCodeLengthLimit),
                    insightLocale = urlArguments[2],// for widget need to fix it
                    pollId = urlArguments[0];

                App.locale = insightLocale || App.config.DEFAULT_LOCALE;
                App.config.widgetType = 'insight-desktop';

                require(
                    [
                        'insight-desktop/js/insight-main'
                    ],
                    function(insightWidget) {
                        var widgetToken = window.owPreparedData.urlArguments.widgetToken;//,
                            // langBasePath =  typeof owPreparedData !== 'undefined' ? App.config.FRONT_STATIC : App.config.DOMAIN_URL,
                            // langPath = langBasePath + 'external/languages-dist/insight/';

                        $.i18n.getDictionaries($.extend({}, App.config.i18n_PROPERTIES, {
                            language: [App.locale],
                            name: App.config.i18n_PROPERTIES.name,
                            path: App.config.i18n_PROPERTIES.path,
                            callback: function() {
                                App.createPage({
                                    view: insightWidget,
                                    css: ['ui-overall-insight'],
                                    additionalOptions: {
                                        widgetToken: widgetToken,
                                        widgetId: widgetId,
                                        pollId: pollId,
                                        urlArguments: urlArguments,
                                        name: App.config.i18n_PROPERTIES.name,
                                        insightLocale: insightLocale
                                        // translationsPath: langPath
                                    }
                                });
                            }
                        }));
                    }
                );
            }
        });

        return new insightDesktopRouter();
    }
);
} catch(err) {
    ga('send', 'exception', {
        'exDescription': err.message,
        'exFatal': false
    });
}