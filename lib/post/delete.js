const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/lib/github');

/**
 * Deletes a post.
 *
 * @exports delete
 * @param {Object} req Request
 * @param {Object} postData Stored post data object
 * @returns {Boolean} True if post is deleted
 */
module.exports = async (req, postData) => {
  // Get type
  const {type} = postData.post;

  // Get publish path
  const {path} = postData.post;

  // Delete post from GitHub
  const response = await github.deleteFile(path, {
    message: req.__mf('{icon} %s deleted\nwith {app}', req.__(`post.${type}`), {
      app: config.name,
      icon: ':x:'
    })
  });

  if (response) {
    return true;
  }
};
