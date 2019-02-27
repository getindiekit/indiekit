/**
 * Derives content (HTML, else object value, else property value)
 *
 * @memberof microformats
 * @module derviveContentProperty
 * @param {Object} mf2 microformats2 object
 * @returns {Array} Content
 */
module.exports = mf2 => {
  let {content} = mf2.properties;

  if (content) {
    content = content[0].html || content[0].value || content[0];
    return new Array(content);
  }

  return null;
};
