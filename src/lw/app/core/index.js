import defaultCollection from './collections/defaultCollection';
import defaultView from './views/defaultView';
import defaultModel from './models/defaultModel';
import defaultRouter from './routers/defaultRouter';
import config from './config';
import $ from "./libs/zepto";
import _ from "underscore";

const App = {
  View: { defaultView },

  Model: { defaultModel },

  Collection: { defaultCollection },

  Router: { defaultRouter },

  auth: {},

  config: config,

  createPage: function (params) {
    var View = params.view || App.View.defaultView,
      cssArr = params.css || [],
      additionalViewParams = params.additionalOptions || {},
      language = params.language || App.config.i18n_PROPERTIES.language,
      name = additionalViewParams.name,
      i18nOptions = {
        language: language,
        callback: function () {
          App.createView(View, additionalViewParams);
        }
      };
    if (name) {
      i18nOptions.name = name;
    }
    if (name === 'insight-messages') {
      i18nOptions.showLoader = false;
    }

    addCss(cssArr);

    $.i18n.properties(_.extend({}, i18nOptions));
  },

  createView: function (View, options) {
    var viewExtended = View;

    if (!_.isEmpty(options)) _.extend(viewExtended.__super__, options);
    return new viewExtended();
  }
};

function addCss(cssArr) {
  console.error('___', config)
  if (config.environment.mode === 'local') {
    injectCss(cssArr);
  }

  addCssScopes(cssArr);
}

function injectCss(cssArr) {
  var head = document.getElementsByTagName('head')[0],
    cssTags = document.createDocumentFragment(),
    index = cssArr.length,
    cssTag;

  while (index--) {
    cssTag = document.createElement('link');
    cssTag.setAttribute('rel', 'stylesheet');
    cssTag.setAttribute('href', App.config.PATH_MOBILE_WIDGET + App.config.widgetType + '/css/' + cssArr[index] + '.css');
    cssTags.appendChild(cssTag);
  }

  head.appendChild(cssTags);
}

function addCssScopes(cssArr) {
  var body = document.getElementsByTagName('body')[0],
    DEFAULT_CLASS_NAMES = 'default';

  body.className = '';
  body.className = DEFAULT_CLASS_NAMES;

  for (var fileIndex in cssArr) {
    $('body').addClass(cssArr[fileIndex].split('/').join('-'));
  }
}

export default App;