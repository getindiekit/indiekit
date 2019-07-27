const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const record = require(process.env.PWD + '/app/lib/record');
const savePost = require('./save-post');

/**
 * Updates a post
 *
 * @memberof micropub
 * @module undeletePost
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Object} Express response object
 */
module.exports = [
  (req, res, next) => {
    const {action} = req.query || req.body;
    return (action === 'undelete') ? auth.scope('create') : next();
  },
  async (req, res, next) => {
    const {action, url} = req.query || req.body;

    if (action && url) {
      const recordData = record.read(url);
      const {mf2} = recordData;
      const {files} = req;

      try {
        const {pub} = req.app.locals;
        const location = await savePost(pub, mf2, files);

        if (location) {
          res.header('Location', location);
          const success_description = `Post undeleted from ${location}`;
          logger.error('micropub.undeletePost: %s', success_description);
          return res.status(201).json({
            success: 'delete_undelete',
            success_description
          });
        }
      } catch (error) {
        const error_description = `Unable to undelete ${url}. ${error.message}`;
        logger.error('micropub.undeletePost: %s', error_description);
        return res.status(500).json({
          error: 'server_error',
          error_description
        });
      }
    }

    return next();
  }
];
