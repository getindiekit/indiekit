const {IndieKitError} = require(process.env.PWD + '/app/errors');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
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
        return indieauth.checkScope('delete')(req, res, next);
      case 'undelete':
        return indieauth.checkScope('create')(req, res, next);
      case 'update':
        return indieauth.checkScope('update')(req, res, next);
      default:
        return next();
    }
  },
  // Determine action, and execute requested operation
  async (req, res, next) => {
    const {action, url} = req.query || req.body;

    // If no action or url provided, throw to next error handler
    if (!action || url === undefined) {
      return next(new IndieKitError({
        status: 400,
        error: 'invalid_request',
        error_description: 'Request is missing required url parameter'
      }));
    }

    // Check if url has record data assigned to it
    const recordData = record.get(url);
    if (recordData === undefined) {
      return res.status(404).json({
        error: 'not_found',
        error_description: `No record found for ${url}`
      });
    }

    switch (action) {
      case 'delete': {
        await post.delete(recordData);
        return res.status(200).json({
          success: 'delete',
          success_description: `Post deleted from ${url}`
        });
      }

      case 'undelete': {
        const {pub} = req.app.locals;
        const {mf2} = recordData;
        const location = post.undelete(pub, mf2);
        res.header('Location', location);
        return res.status(200).json({
          success: 'delete_undelete',
          success_description: `Post undeleted from ${url}`
        });
      }

      case 'update': {
        return res.status(501).json({
          error: 'not_implemented',
          error_description: `Cannot update ${url}`
        });
      }

      default:
    }
  }
];
