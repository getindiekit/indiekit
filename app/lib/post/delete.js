const {IndieKitError} = require(process.env.PWD + '/app/errors');
const github = require(process.env.PWD + '/app/lib/github');

/**
 * Deletes a post
 *
 * @memberof post
 * @module delete
 * @param {Object} recordData Post to delete
 * @returns {Boolean} True if post is deleted
 */
module.exports = async recordData => {
  await github.deleteFile(recordData.post.path, {
    message: ':x: Deleted post'
  }).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  return true;
};
