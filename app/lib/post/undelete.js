const post = require(process.env.PWD + '/app/lib/post');

/**
 * Undeletes a post
 *
 * @memberof post
 * @module undelete
 * @param {Object} pub Publication configuration
 * @param {Object} mf2 Microformats2 object
 * @returns {String} Location of undeleted post
 */
module.exports = async (pub, mf2) => {
  const location = await post.create(pub, mf2);

  return location;
};
