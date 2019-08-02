/**
 * Returns an array of supported post types
 *
 * @memberof publication
 * @module getPostTypes
 * @param {String} pub Publication configuration
 * @returns {Array} Array of post types
 */
module.exports = pub => {
  const pubPostTypes = pub['post-types'];
  const postTypes = [];

  if (pubPostTypes) {
    for (const [key, value] of Object.entries(pubPostTypes)) {
      const postType = {
        type: key,
        name: value.name
      };
      postTypes.push(postType);
    }
  }

  return postTypes;
};
