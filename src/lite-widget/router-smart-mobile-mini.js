require(
	[
        'app',
        'helpers/ajax/ajax-wrapper',
        'helpers/settings/merge-widget-settings-with-defaults',
        'helpers/settings/widget-types/smart-mobile-mini'
    ],
    function (App, Ajax, MergeWithDefault, smartDefaultSettings) {
        var smartRouter = App.Router.defaultRouter.extend({
            routes: {
                '!/widget/:widgetCode': 'smartMobileMini'
            },
            smartMobileMini: function (widgetCode) {
                var widgetCodeLengthLimit = 36;
                    widgetCode = widgetCode.substr(0, widgetCodeLengthLimit);

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'widget/' + widgetCode,
                    cacheByDomain: true,
                    type: 'POST',
                    data: {
                        deviceType: 'mobile'
                    },
                    dataType: 'json',
                    success: function(widgetParams) {
                        widgetParams.rotationFrequency = parseInt(widgetParams.rotationFrequency);
                        delete window.owPreparedData.urlArguments.type;
                        _.extend(widgetParams, window.owPreparedData.urlArguments);
                        
                        widgetParams.width = smartDefaultSettings.width;
                        widgetParams.height = smartDefaultSettings.height;
                        widgetParams.minHeight = smartDefaultSettings.minHeight;
                        widgetParams.minWidth = smartDefaultSettings.minWidth;

                        App.config.widgetType = smartDefaultSettings.customType;

                        MergeWithDefault(widgetParams, smartDefaultSettings);
                        require(
                            [
                                'smart-mobile-mini/smart'
                            ],
                            function(smartMobileView) {
                                App.createPage({
                                    css: ['imu'],
                                    view: smartMobileView,
                                    urlArguments: window.owPreparedData.urlArguments,
                                    additionalOptions: widgetParams,
                                    language: widgetParams.displayLocale
                                });
                            }
                        );
                    }
                });
            }
        });

        new smartRouter();
    }
);