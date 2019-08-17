const getType = require('post-type-discovery');

/**
 * Combines referenced and attached photos into one object which can be used in
 * a microformats2 object. Attached photos are uploaded to GitHub.
 *
 * @exports derivePostType
 * @param {Object} mf2 microformats2 object
 * @returns {String} Post type
 */
module.exports = mf2 => {
  // Experimental post types not supported by getType()
  // @see: https://indieweb.org/posts
  if (mf2.properties['bookmark-of']) {
    return 'bookmark';
  }

  if (mf2.properties.checkin) {
    return 'checkin';
  }

  if (mf2.properties.start) {
    return 'event';
  }

  // Create the `items` array getType() expects
  const items = {items: [mf2]};
  return getType(items);
};
