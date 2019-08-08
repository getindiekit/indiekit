const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const logger = require(process.env.PWD + '/app/logger');
const media = require(process.env.PWD + '/app/lib/media');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const post = require(process.env.PWD + '/app/lib/post');

/**
 * Creates a post
 *
 * @memberof micropub
 * @module createPost
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Promise} Express response object
 */
module.exports = [
  (req, res, next) => {
    return indieauth.checkScope('create')(req, res, next);
  },
  async (req, res) => {
    const {body, files} = req;
    const {pub} = req.app.locals;

    // Upload attached files and add push value to body
    if (files && files.length > 0) {
      for (const file of files) {
        if (!file || file.truncated || !file.buffer) {
          logger.error('micropub.createPost was unable to process attached file', {file});
        }

        // Get property type from files fieldname
        const property = file.fieldname.replace('[]', '');
        if (!body[property]) {
          body[property] = [];
        }

        const value = await media.create(pub, file).catch(error => {
          throw new Error(error);
        });

        if (value) {
          body[property].push(value);
        }
      }
    }

    // Normalise form-encoded requests as mf2 JSON
    const mf2 = req.is('json') ? body : microformats.formEncodedToMf2(body);

    const location = await post.create(pub, mf2).catch(error => {
      return res.status(500).json({
        error: 'server_error',
        error_description: `Unable to create post. ${error.message}`
      });
    });

    res.header('Location', location);
    return res.status(202).json({
      success: 'create_pending',
      success_description: `Post will be created at ${location}`
    });
  }
];
