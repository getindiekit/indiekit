const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const record = require(process.env.PWD + '/app/lib/record');
const savePost = require('./save-post');

/**
 * Updates a post
 *
 * @memberof micropub
 * @module undeletePost
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express next function
 * @returns {Object} Express response object
 */
module.exports = [
  (request, response, next) => {
    const {action} = request.query || request.body;
    return (action === 'undelete') ? auth.scope('create') : next();
  },
  async (request, response, next) => {
    const {action, url} = request.query || request.body;

    if (action && url) {
      const recordData = record.read(url);
      const {mf2} = recordData;
      const {files} = request;

      try {
        const {pub} = request.app.locals;
        const location = await savePost(pub, mf2, files);

        if (location) {
          logger.info('micropub.undeletePost: %s', location);
          response.header('Location', location);
          return response.status(201).json({
            success: 'delete_undelete',
            success_description: `Post undeleted from ${location}`
          });
        }
      } catch (error) {
        logger.error('micropub.undeletePost', {error});
        return response.status(500).json({
          error: 'server_error',
          error_description: `Unable to undelete post. ${error.message}`
        });
      }
    }

    return next();
  }
];
