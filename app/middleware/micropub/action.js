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
      const data = store.get(url);
      if (data === undefined) {
        return res.status(404).json({
          error: 'Not found',
          error_description: `No record found for ${url}`
        });
      }

      switch (action) {
        case 'delete': {
          const deleted = await post.delete(data).catch(error => {
            return next(error);
          });

          if (deleted) {
            return res.status(200).json({
              success: 'delete',
              success_description: `Post deleted from ${url}`
            });
          }

          break;
        }

        case 'undelete': {
          const undeleted = await post.undelete(pub, data).catch(error => {
            return next(error);
          });

          if (undeleted) {
            res.header('Location', undeleted.post.url);
            return res.status(200).json({
              success: 'delete_undelete',
              success_description: `Post undeleted from ${url}`
            });
          }

          break;
        }

        case 'update': {
          const updated = await post.update(pub, data, req.body).catch(error => {
            return next(error);
          });

          if (updated) {
            const hasUpdatedUrl = (url !== updated.post.url);
            const status = hasUpdatedUrl ? 201 : 200;
            const success_description = hasUpdatedUrl ?
              `Post updated and moved to ${updated.post.url}` :
              `Post updated at ${url}`;

            res.header('Location', updated.post.url);
            return res.status(status).json({
              success: 'update',
              success_description
            });
          }

          break;
        }

        default:
      }
    }

    return next();
  }
];
