const auth = require(process.env.PWD + '/app/lib/auth');
const logger = require(process.env.PWD + '/app/logger');
const post = require(process.env.PWD + '/app/lib/post');
const record = require(process.env.PWD + '/app/lib/record');

/**
 * Performs action on an existing post
 *
 * @memberof micropub
 * @module action
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Function} Express response object
 */
module.exports = [
  // Determine action, and continue if token has required scope
  (req, res, next) => {
    const {action} = req.query || req.body;
    switch (action) {
      case 'delete':
        return auth.scope.middleware('delete')(req, res, next);
      case 'undelete':
        return auth.scope.middleware('create')(req, res, next);
      case 'update':
        return auth.scope.middleware('update')(req, res, next);
      default:
        return next();
    }
  },
  // Determine action, and execute requested operation
  (req, res, next) => {
    const {action, url} = req.query || req.body;

    // If no action provided, continue to next middleware
    if (!action) {
      return next();
    }

    // Check if url parameter has been provided
    if (url === undefined) {
      const error_description = 'Request is missing required url parameter';
      logger.error('micropub.action: %s', error_description);
      return res.status(400).json({
        error: 'invalid_request',
        error_description
      });
    }

    // Check if url has record data assigned to it
    const recordData = record.get(url);
    if (recordData === undefined) {
      const error_description = `No record found for ${url}`;
      logger.error('micropub.action: %s', error_description);
      return res.status(404).json({
        error: 'not_found',
        error_description
      });
    }

    switch (action) {
      case 'delete': {
        if (post.delete(recordData)) {
          return res.status(200).json({
            success: 'delete',
            success_description: `Post deleted from ${url}`
          });
        }

        break;
      }

      case 'undelete': {
        const {pub} = req.app.locals;
        const {mf2} = recordData;
        const location = post.undelete(pub, mf2);
        if (location) {
          res.header('Location', location);
          return res.status(200).json({
            success: 'delete_undelete',
            success_description: `Post undeleted from ${url}`
          });
        }

        break;
      }

      case 'update': {
        return post.undelete(url)(req, res, next);
      }

      default: {
        return next();
      }
    }
  }
];
