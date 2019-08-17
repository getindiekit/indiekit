const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const store = require(process.env.PWD + '/lib/store');

/**
 * Returns information about the media endpoint.
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback function
 * @returns {Promise} Express response object
 */
module.exports = async (req, res, next) => {
  const {query} = req;
  switch (query.q) {
    case 'last': {
      // Return URL of last uploaded file
      try {
        const uploads = store.getRecords('media', 'upload');
        return res.json({
          url: uploads[uploads.length - 1].url
        });
      } catch (error) {
        return next(new IndieKitError({
          status: 404,
          error: 'Not found',
          error_description: 'No uploaded file records found'
        }));
      }
    }

    default:
  }

  return next(new IndieKitError({
    status: 400,
    error: 'Invalid request',
    error_description: 'Request is missing required parameter, or there was a problem with value of one of the parameters provided'
  }));
};
