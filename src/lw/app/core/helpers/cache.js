const cache = {};

/**
 * Write data to cache
 * @param key
 * @param value
 * @param [saveTime] / minutes
 */
cache.write = function(key, value, saveTime) {

  if (typeof saveTime == 'undefined') {
    return;
  }

  localStorage.setItem(key, JSON.stringify({
    'value': value,
    'expireDate': getStampMinutes() + saveTime,
    'creationDate': new Date().getTime()
  }));
};

/**
 * Read data from cache
 * @param key
 * @param [lifeTime] / minutes
 */
cache.read = function(key, lifeTime) {
  var result = null;
  var object = localStorage.getItem(key);

  if (!object) {
    result = null;
  } else {

    object = JSON.parse(object);

    if (object.expireDate > getStampMinutes() &&
      ('undefined' === typeof lifeTime || (parseInt(object.creationDate) + (lifeTime * 1000 * 60)) > (new Date().getTime()))
    ) {
      result = object.value;
    } else {
      clear(key);
      result = null;
    }
  }

  return result;
};

function clear(key) {
  return localStorage.removeItem(key);
}

/**
 * Get curent time stamp in minutes
 */
function getStampMinutes() {
  return Math.round(new Date().getTime() / (1000 * 60));
}

export default cache;