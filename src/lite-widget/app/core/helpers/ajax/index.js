import config from '../../config';
import _ from 'underscore';
import $ from '../../libs/zepto';

let isLoaderActive = false;

const ajax = function(settings) {
  var preparedData = getPreparedData(settings),
    showLoader = !_.isUndefined(settings.showLoader) ? settings.showLoader : true;

  settings.uniqId = Math.floor(Math.random() * 99);
  settings.beforeSend = beforeSend;

  function beforeSend(xhr, settings) {
    if (typeof ajax.pending === 'undefined') ajax.pending = {};

    ajax.pending[settings.uniqId] = xhr;
    xhr.uniqId = settings.uniqId;
    xhr.ontimeout = removeFromPending;
    xhr.onerror = removeFromPending;
    xhr.onabort = removeFromPending;
    xhr.onload = removeFromPending;
    xhr.withCredentials = true;

    if (!_.isEmpty(ajax.pending) && !isLoaderActive && showLoader) {
      $('#loaderDiv').show();
      isLoaderActive = true;
    }

    if ('undefined' !== typeof preparedData) {
      settings.success(preparedData);
      xhr.onload({ fromPrepared: true });

      return false;
    }
  }

  function finishExternalRequest() {
    window.removeEventListener('message', finishExternalRequest, false);
    settings.success(getPreparedData(settings));
  }

  function removeFromPending(progress) {
    delete ajax.pending[this.uniqId];

    if (_.isEmpty(ajax.pending) && isLoaderActive) {
      $('#loaderDiv').hide();
      isLoaderActive = false;
    }

    if ((this.status !== 200 && this.status !== 401 && this.status !== 204) && !('fromPrepared' in progress)) {
      if (this.responseURL) {
        ga('send', 'event', 'API call error: ' + this.responseURL);
      }
      else {
        ga('send', 'event', 'API call error');
      }
    }
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  if (settings.cacheByDomain) {
    settings.cache = true;
    settings.type = 'GET';

    if (cacheByDomain()) {
      settings.headers = {
        'X-Disable-Cache': 'true'
      };
    }
  }

  // add _=1 to URL if there is '1wSession' cookie is 'true'
  if (settings.cacheIfNoSession) {
    if (getCookie('1wSession') === 'true') {
      settings.data['_'] = 1;
    }
  }

  if (settings.fromExternalAjax) {
    if (typeof getPreparedData(settings) === 'undefined') {
      window.addEventListener('message', finishExternalRequest);
    }
    else {
      settings.success(getPreparedData(settings));
    }
  }
  else {
    $.ajax(settings);
  }
};

function getPreparedData(xhrSettings) {
  var result = undefined,
    apiName =  xhrSettings.preparedDataApi ? xhrSettings.preparedDataApi : xhrSettings.url.replace(/(^.+\/)?/, '');

  if ('undefined' !== typeof window.owPreparedData &&
    'undefined' !== typeof window.owPreparedData[apiName] &&
    !('onload' in window.owPreparedData[apiName])) {
    result = window.owPreparedData[apiName];
  }

  return result;
}

function cacheByDomain() {
  var cache;

  if (window.owPreparedData && typeof window.owPreparedData.urlArguments !== 'undefined') {
    cache = window.owPreparedData.urlArguments.location.search(config.DISABLE_CACHE_DOMAIN) !== -1;
  }

  return cache;
}

export default ajax;