const getType = require('post-type-discovery');

/**
 * Discover the post type from a microformats2 object.
 *
 * @memberof microformats
 * @module deviveType
 * @param {object} mf2 A mf2 json object
 * @return {String} Type of post
 */
module.exports = mf2 => {
  // The getType() function expects an array of `items`
  if (typeof mf2 === 'object') {
    mf2 = {items: new Array(mf2)};
  }

  return getType(mf2);
};
