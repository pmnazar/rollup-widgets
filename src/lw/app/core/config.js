import _ from 'underscore';
import conf from '../../config.js';

const config = {};
config.environment = {};
config.environment.mode = conf.DEBUG_MODE ? 'local': 'prod';

if (conf.FRONT_STATIC.indexOf('https') === -1 &&
  conf.FRONT_STATIC.indexOf('http') === -1) {
  conf.FRONT_STATIC = window.location.protocol + conf.FRONT_STATIC;
}

conf.FRONTEND_SOURCES_URL = conf.DOMAIN_URL + 'external/';

conf.PATH_TO_EXTERNAL = conf.DOMAIN_URL + 'external/';
conf.URL_SERVER = conf.URL_SERVER_API_NEW + '1ws/json/';
conf.URL_SERVER_REST = conf.URL_SERVER_API_NEW + "1ws/rest/";
conf.URL_SERVER_API = conf.URL_SERVER_API_NEW + "1ws/api/json/";
conf.URL_SERVER_LOGIN = conf.URL_SERVER_API_NEW + "1ws/";
conf.URL_AGGREGATED_API = conf.URL_SERVER_API_NEW + "1ws/c/2/json/ApiAggregator";

conf.PATH_CSS = (conf.USE_MINIFIED_CSS_ONLY ? conf.FRONT_STATIC : 'external/build/temp/') + 'css/';
conf.PATH_IMG = (conf.USE_MINIFIED_CSS_ONLY ? conf.FRONT_STATIC : 'external/build/temp/') + 'img/';
conf.PATH_MOBILE_WIDGET = conf.FRONTEND_SOURCES_URL + 'js/views/overall/lite-widget/';

conf.UNMINIFIED_CSS_FILES = [];
conf.DEFAULT_CSS = [];
conf.css = [];
conf.i18n_PROPERTIES.name = 'smart-messages';
conf.i18n_PROPERTIES.mode = "both";
conf.i18n_PROPERTIES.language = conf.DEFAULT_LOCALE;
conf.i18n_PROPERTIES.cache = false;
conf.i18n_PROPERTIES.path = 'smart/';

export default _.extend(conf, config);