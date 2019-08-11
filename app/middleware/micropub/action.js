const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const auth = require(process.env.PWD + '/app/middleware/auth');
const post = require(process.env.PWD + '/lib/post');
const store = require(process.env.PWD + '/lib/store');

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
        return auth.checkScope('delete')(req, res, next);
      case 'undelete':
        return auth.checkScope('create')(req, res, next);
      case 'update':
        return auth.checkScope('update')(req, res, next);
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

    // Check if url has store record assigned to it
    const storeData = store.get(url);
    if (storeData === undefined) {
      return res.status(404).json({
        error: 'not_found',
        error_description: `No record found for ${url}`
      });
    }

    switch (action) {
      case 'delete': {
        const {path} = storeData.post;
        await post.delete(path);
        return res.status(200).json({
          success: 'delete',
          success_description: `Post deleted from ${url}`
        });
      }

      case 'undelete': {
        const {pub} = req.app.locals;
        const {mf2} = storeData;
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
