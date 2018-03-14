import App from '../../';
import _ from 'underscore';

const CheckCookies = function (callbackSuccess) {
  var pingWindow,
    cookiesArray,
    isCookiesExist,
    checkCookiesDocument,
    killPing,
    timeRepeat = 0,
    isCookiesEnabled = (navigator.cookieEnabled) ? true : false;

  checkCookiesDocument = function () {
    cookiesArray = document.cookie.split(/[;= ]/);

    return _.find(cookiesArray, function (name) {
      return name === '1w_supports_cookies' ? isCookiesExist = true : isCookiesExist = false;
    });
  };

  killPing = function () {
    callbackSuccess();
    clearTimeout(checkDocumentCookies);
  };

  checkCookiesDocument();

  if (!isCookiesExist && isCookiesEnabled) {
    pingWindow = window.open(App.config.DOMAIN_URL + '1ws/rep/ping', '_blank', 'width=100, height=100');

    var checkDocumentCookies = setInterval(function () {
      /*iOS 5-8 fix*/
      if (navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS (6_|7_|8_)\d/i)) {
        killPing();
      }
      else {
        checkCookiesDocument();
        if (document.cookie.split(/[;= ]/).length >= 2) {
          killPing();
        }
        else {
          timeRepeat++;
          if (timeRepeat > 10) {
            killPing();
          }
        }
      }
    }, 200);
  }
  else if (isCookiesExist) {
    callbackSuccess();
  }
  else {
    ga('send', 'event', '1w_cookies_setup_fail');
    callbackSuccess();
  }
};

export default CheckCookies;