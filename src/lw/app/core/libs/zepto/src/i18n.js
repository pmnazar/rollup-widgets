import $ from 'zepto-modules/zepto';
import conf from '../../../../../config';
import Ajax from '../../../helpers/ajax';

$.i18n = {};
$.i18n.map = {};

$.i18n.properties = function (localeSettings) {
  var currentFileName;
  var settings = {
    name: conf.i18n_PROPERTIES.name,
    path: conf.i18n_PROPERTIES.path,
    mode: conf.i18n_PROPERTIES.mode,
    language: localeSettings.language,
    cache: conf.i18n_PROPERTIES.cache,
    callback: localeSettings.callback
  };

  if (!settings.language) {
    settings.language = $.i18n.browserLang();
  }
  var locale = settings.language.substring(0, 2);

  if (window.owPreparedData) {
    currentFileName = settings.path + window.owPreparedData.langManifest[settings.name + '_' + locale + '.json'];
  }

  getCurrentLanguage(currentFileName, settings);
};

$.i18n.prop = function (key /* Add parameters as function arguments as necessary  */) {
  var methodArguments = arguments;
  var parsedStr;
  var value = $.i18n.map[key];

  if (value == null) {
    parsedStr = '[' + key + ']';
  }
  else if ("string" === typeof value) {
    parsedStr = value.replace(new RegExp('\{([0-9]+?)\}', "gm"), function (comparison, digit) {
      var digit = parseInt(digit);

      return (digit + 1 < methodArguments.length) ? methodArguments[digit + 1] : comparison;
    });
  }
  else {
    parsedStr = value;
  }

  return parsedStr;
};

/** Language reported by browser, normalized code */
$.i18n.browserLang = function () {
  return normaliseLanguageCode(navigator.language /* Mozilla */ || navigator.userLanguage /* IE */);
};

function getCurrentLanguage(filename, settings) {
  return Ajax({
    url: filename,
    contentType: "application/json",
    dataType: "json",
    success: function (currentLanguage) {

      $.i18n.map = currentLanguage;
      settings.callback();
    }
  });
}

/** Ensure language code is in the format aa_AA. */
function normaliseLanguageCode(lang) {
  lang = lang.toLowerCase();

  if (lang.length > 3) {
    lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
  }

  return lang;
}

export default $;