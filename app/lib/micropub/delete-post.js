const auth = require(process.env.PWD + '/app/lib/auth');
const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');
const record = require(process.env.PWD + '/app/lib/record');
const store = require(process.env.PWD + '/app/lib/store');

/**
 * Deletes a post
 *
 * @memberof micropub
 * @module deletePost
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express next function
 * @returns {Promise} Express response object
 */
module.exports = [
  auth.scope('delete'),
  async (request, response, next) => {
    const {action} = request.query || request.body;

    if (action === 'delete') {
      const url = request.query || request.body;
      const recordData = record.read(url);

      if (recordData) {
        try {
          const storePath = recordData.post.path;
          const response = await store.github.deleteFile(storePath, {
            message: `:x: Deleted post\nwith ${config.name}`
          });
          if (response) {
            return response.status(200).json({
              success: 'delete',
              success_description: `Post deleted from ${url}`
            });
          }
        } catch (error) {
          logger.error(error);
          return response.status(500).json({
            error: 'server_error',
            error_description: `Unable to create delete ${url}. ${error.message}`
          });
        }
      }

      return response.status(404).json({
        error: 'not_found',
        error_description: `No record found for ${url}`
      });
    }

    return next();
  }
];
