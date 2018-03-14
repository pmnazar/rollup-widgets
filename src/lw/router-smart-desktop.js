import App from './app/core';
import Ajax from './app/core/helpers/ajax';
import MergeWithDefault from './app/core/helpers/settings/merge-widget-settings-with-defaults';
import smartDefaultSettings from './app/core/helpers/settings/widget-types/smart3';
import smartDesktop from './smart-desktop';
import _ from 'underscore';

const SmartDesktop = App.Router.defaultRouter.extend({
  routes: {
    '!/widget/:widgetCode': 'smartDesktop'
  },
  smartDesktop: function (widgetCode) {
    const widgetCodeLengthLimit = 36;

    widgetCode = widgetCode.substr(0, widgetCodeLengthLimit);
    Ajax({
      url: App.config.URL_SERVER_API_NEW + 'widget/' + widgetCode,
      cacheByDomain: true,
      type: 'POST',
      dataType: 'json',
      success: function (widgetParams) {
        widgetParams.rotationFrequency = parseInt(widgetParams.rotationFrequency);
        if (window.owPreparedData) {
          delete window.owPreparedData.urlArguments.type;
          _.extend(widgetParams, window.owPreparedData.urlArguments);
        }

        widgetParams.minWidth = smartDefaultSettings.minWidth;
        widgetParams.minHeight = smartDefaultSettings.minHeight;
        App.config.widgetType = smartDefaultSettings.customType;

        MergeWithDefault(widgetParams, smartDefaultSettings);

        App.createPage({
          css: ['overall-widget-smart'],
          view: smartDesktop,
          additionalOptions: widgetParams,
          language: widgetParams.displayLocale
        });
      }
    });
  }
});

export default new SmartDesktop();