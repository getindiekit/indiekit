const auth = require(process.env.PWD + '/app/middleware/auth');
const media = require(process.env.PWD + '/lib/media');

/**
 * Uploads a media file.
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
    const created = await media.create(req).catch(error => {
      return next(error);
    });

    if (created) {
      res.header('Location', created.upload.url);
      return res.status(201).json({
        success: 'create',
        success_description: `Media saved to ${created.upload.url}`
      });
    }
  }
];
