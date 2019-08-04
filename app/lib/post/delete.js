const logger = require(process.env.PWD + '/app/logger');
const store = require(process.env.PWD + '/app/lib/store');

/**
 * Deletes a post
 *
 * @memberof post
 * @module delete
 * @param {Object} recordData Post to delete
 * @returns {Boolean} True if post is deleted
 */
module.exports = async recordData => {
  try {
    const response = await store.github.deleteFile(recordData.post.path, {
      message: ':x: Deleted post'
    });

    if (response) {
      logger.info('post.delete', {recordData});
      return true;
    }
  } catch (error) {
    logger.error('post.delete', {error});
    throw new Error(error);
  }
};
