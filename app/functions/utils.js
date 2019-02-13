/**
 * Decode x-www-form-urlencoded string
 *
 * @example decodeFormEncodedString('foo+bar') => 'foo bar'
 * @example decodeFormEncodedString('http%3A%2F%2Ffoo.bar') => 'http://foo.bar'
 * @param {String} string Request
 * @return {String} Decoded string
 *
 */
exports.decodeFormEncodedString = function (string) {
  if (typeof string === 'string') {
    string = string.replace(/\+/g, '%20');
    string = decodeURIComponent(string);
  }

  return string;
};

exports.removeEmptyObjectKeys = function (object) {
  for (const key in object) {
    if (!object[key] || typeof object[key] !== 'object') {
      continue;
    }

    module.exports.removeEmptyObjectKeys(object[key]);

    if (Object.keys(object[key]).length === 0) {
      delete object[key];
    }
  }

  return object;
};
