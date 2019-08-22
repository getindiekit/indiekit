const auth = require(process.env.PWD + '/app/middleware/auth');
const post = require(process.env.PWD + '/lib/post');
const store = require(process.env.PWD + '/lib/store');

/**
 * Performs action on an existing post.
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Function} Express response object
 */
module.exports = [
  // Determine action, and continue if token has required scope
  (req, res, next) => {
    const action = req.query.action || req.body.action;
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
    const action = req.query.action || req.body.action;
    const url = req.query.url || req.body.url;
    const {pub} = req.app.locals;

    // If no action or url provided, throw to next middleware (create-post)
    if (action && url) {
      // Check if url has store record assigned to it
      const postData = store.get(url);
      if (postData === undefined) {
        return res.status(404).json({
          error: 'Not found',
          error_description: `No record found for ${url}`
        });
      }

      switch (action) {
        case 'delete': {
          const deletedPost = await post.delete(postData).catch(error => {
            return next(error);
          });

          if (deletedPost) {
            return res.status(200).json({
              success: 'delete',
              success_description: `Post deleted from ${url}`
            });
          }

          break;
        }

        case 'undelete': {
          const undeleted = await post.undelete(pub, postData).catch(error => {
            return next(error);
          });

          if (undeleted) {
            res.header('Location', url);
            return res.status(200).json({
              success: 'delete_undelete',
              success_description: `Post undeleted from ${url}`
            });
          }

          break;
        }

        case 'update': {
          return res.status(501).json({
            error: 'Not implemented',
            error_description: `Cannot update ${url}`
          });
        }

        default:
      }
    }

    return next();
  }
];
