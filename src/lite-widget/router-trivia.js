require(
	[
        'app',
        'helpers/ajax/ajax-wrapper',
        'helpers/settings/merge-widget-settings-with-defaults',
        'helpers/settings/widget-types'
    ],
    function (App, Ajax, MergeWithDefault, triviaDefaultSettings) {
        var triviaRouter = App.Router.defaultRouter.extend({
            routes: {
                '!/widget/:widgetCode': 'triviaWidget'
            },
            triviaWidget: function (widgetCode) {
                var widgetCodeLengthLimit = 36;
                    widgetCode = widgetCode.substr(0, widgetCodeLengthLimit);

                Ajax({
                    url: App.config.URL_SERVER_API_NEW + 'widget/' + widgetCode,
                    cacheByDomain: true,
                    type: 'POST',
                    dataType: 'json',
                    success: function(widgetParams) {
                        delete window.owPreparedData.urlArguments.type;
                        _.extend(widgetParams, window.owPreparedData.urlArguments);
                        
                        widgetParams.minWidth = triviaDefaultSettings.minWidth;
                        widgetParams.minHeight = triviaDefaultSettings.minHeight;
                        App.config.widgetType = triviaDefaultSettings.customType;

                        MergeWithDefault(widgetParams, triviaDefaultSettings);

                        /*if (widgetParams.width > triviaDefaultSettings.maxWidth) {
                            widgetParams.width = triviaDefaultSettings.maxWidth;
                        }*/

                        require(
                            [
                                'trivia/widget-trivia'
                            ],
                            function(triviaWidgetView) {
                                App.createPage({
                                    css: ['overall-widget-trivia'],
                                    view: triviaWidgetView,
                                    additionalOptions: widgetParams,
                                    language: widgetParams.displayLocale
                                });
                            }
                        );
                    }
                });
            }
        });

        new triviaRouter();
    }
);