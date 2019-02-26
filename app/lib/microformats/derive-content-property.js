/**
 * Derives content (HTML, else object value, else property value)
 *
 * @memberof microformats
 * @module derviveContentProperty
 * @param {Object} mf2 microformats2 object
 * @returns {Array} Content
 */
module.exports = mf2 => {
  let content = mf2.properties.content[0];

  if (content) {
    content = content.html || content.value || content;
    return new Array(content);
  }

  return null;
};
