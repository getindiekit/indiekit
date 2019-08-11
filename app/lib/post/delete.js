const github = require(process.env.PWD + '/app/lib/github');

/**
 * Deletes a post
 *
 * @memberof post
 * @module delete
 * @param {Object} path Path to file on GitHub
 * @returns {Boolean} True if post is deleted
 */
module.exports = async path => {
  await github.deleteFile(path, {
    message: ':x: Deleted post'
  });

  return true;
};
