import _ from 'underscore';
import conf from '../../config.js';
const config = {};

config.environment = 'development';

if (conf.FRONT_STATIC.indexOf('https') === -1 &&
  conf.FRONT_STATIC.indexOf('http') === -1) {
  conf.FRONT_STATIC = window.location.protocol + conf.FRONT_STATIC;
}

export default _.extend(conf, config);