const logger = require(process.env.PWD + '/app/logger');

/**
 * Updates a post
 *
 * @memberof post
 * @module update
 * @param {Object} recordData Post to delete
 * @returns {Boolean} True if post is deleted
 */
module.exports = recordData => {
  const error_description = 'Update action not supported';
  logger.error('micropub.updatePost: %s', error_description);
  return res.status(400).json({
    error: 'invalid_request',
    error_description
  });
};
