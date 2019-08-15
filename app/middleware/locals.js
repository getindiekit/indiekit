const publication = require(process.env.PWD + '/lib/publication');

/**
 * Save application and publication configuration to app.locals
 *
 * @memberof locals
 * @param {String} config Application configuration
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express callback
 * @return {Function} next Express callback
 */
module.exports = config => async (req, res, next) => {
  let pubConfig;
  if (config.pub.config) {
    try {
      const pubConfigFile = await publication.getFiles(config.pub.config);
      pubConfig = JSON.parse(pubConfigFile);
    } catch (error) {
      return next(error);
    }
  }

  const {locals} = req.app;
  locals.pub = await publication.resolveConfig(pubConfig);
  locals.pub.url = config.pub.url;

  locals.app = config;
  locals.app.url = `${req.protocol}://${req.headers.host}`;
  return next();
};
