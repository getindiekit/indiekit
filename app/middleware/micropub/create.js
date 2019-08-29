const auth = require(process.env.PWD + '/app/middleware/auth');
const media = require(process.env.PWD + '/lib/media');
const post = require(process.env.PWD + '/lib/post');

/**
 * Creates a post.
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Promise} Express response object
 */
module.exports = [
  (req, res, next) => {
    return auth.checkScope('create')(req, res, next);
  },
  async (req, res, next) => {
    const {body, files} = req;

    // Upload attached files and add push value to body
    if (files && files.length > 0) {
      for (const file of files) {
        // Get property type from files fieldname
        const property = file.fieldname.replace('[]', '');
        if (!body[property]) {
          body[property] = [];
        }

        const value = await media.create(req, {file}).catch(error => {
          return next(error);
        });
        if (value) {
          body[property].push(value);
        }
      }
    }

    const created = await post.create(req).catch(error => {
      return next(error);
    });

    if (created) {
      res.header('Location', created.post.url);
      return res.status(202).json({
        success: 'create_pending',
        success_description: `Post will be created at ${created.post.url}`
      });
    }
  }
];
