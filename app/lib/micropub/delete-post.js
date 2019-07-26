const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const record = require(process.env.PWD + '/app/lib/record');
const store = require(process.env.PWD + '/app/lib/store');

/**
 * Deletes a post
 *
 * @memberof micropub
 * @module deletePost
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Promise} Express response object
 */
module.exports = [
  (req, res, next) => {
    const {action} = req.query || req.body;
    return (action === 'delete') ? auth.scope('delete') : next();
  },
  async (req, res, next) => {
    const {action, url} = req.query || req.body;

    if (action && url) {
      const recordData = record.read(url);

      if (recordData) {
        try {
          const storePath = recordData.post.path;
          const response = await store.github.deleteFile(storePath, {
            message: ':x: Deleted post'
          });
          if (response) {
            return response.status(200).json({
              success: 'delete',
              success_description: `Post deleted from ${url}`
            });
          }
        } catch (error) {
          logger.error('micropub.deletePost', {error});
          return res.status(500).json({
            error: 'server_error',
            error_description: `Unable to create delete ${url}. ${error.message}`
          });
        }
      }

      return res.status(404).json({
        error: 'not_found',
        error_description: `No record found for ${url}`
      });
    }

    return next();
  }
];
