require(
	[
        'app',
        'helpers/ajax/ajax-wrapper',
        'helpers/settings/merge-widget-settings-with-defaults',
        'helpers/settings/widget-types'
    ],
    function (App, Ajax, MergeWithDefault, smartDefaultSettings) {
        var smartRouter = App.Router.defaultRouter.extend({
            routes: {
                '!/widget/:widgetCode': 'smartMobile'
            },
            smartMobile: function (widgetCode) {
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
                        
                        widgetParams.minWidth = smartDefaultSettings.minWidth;
                        widgetParams.minHeight = smartDefaultSettings.minHeight;
                        App.config.widgetType = smartDefaultSettings.customType;

                        MergeWithDefault(widgetParams, smartDefaultSettings);
                        if (widgetParams.width > smartDefaultSettings.maxWidth) {
                            widgetParams.width = smartDefaultSettings.maxWidth;
                        }

                        require(
                            [
                                'smart-mobile/smart'
                            ],
                            function(smartMobileView) {
                                App.createPage({
                                    css: ['overall-widget-mobile-poller'],
                                    view: smartMobileView,
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