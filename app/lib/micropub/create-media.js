const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const media = require(process.env.PWD + '/app/lib/media');

/**
 * Creates a new media file
 *
 * @memberof micropub
 * @module createMedia
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
    const {file} = req;
    const {pub} = req.app.locals;

    if (!file || file.truncated || !file.buffer) {
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'No files included in request'
      });
    }

    const location = await media.create(pub, file).catch(error => {
      return res.status(500).json({
        error: 'server_error',
        error_description: `Unable to create file. ${error.message}`
      });
    });

    res.header('Location', location);
    return res.status(201).json({
      success: 'create',
      success_description: `File created at ${location}`
    });
  }
];
