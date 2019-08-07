const github = require(process.env.PWD + '/app/lib/github');
const logger = require(process.env.PWD + '/app/logger');

/**
 * Deletes a post
 *
 * @memberof post
 * @module delete
 * @param {Object} recordData Post to delete
 * @returns {Boolean} True if post is deleted
 */
module.exports = async recordData => {
  const response = await github.deleteFile(recordData.post.path, {
    message: ':x: Deleted post'
  }).catch(error => {
    logger.error('post.delete', {error});
    throw new Error(error);
  });

  if (response) {
    logger.info('post.delete', {recordData});
    return true;
  }
};
