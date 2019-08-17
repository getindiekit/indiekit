const github = require(process.env.PWD + '/lib/github');

/**
 * Deletes a post.
 *
 * @exports delete
 * @param {Object} postData Stored post data object
 * @returns {Boolean} True if post is deleted
 */
module.exports = async postData => {
  const {path} = postData.post;

  await github.deleteFile(path, {
    message: ':x: Deleted post'
  });

  return true;
};
