const appConfig = require(__basedir + '/config');
const cache = require(__basedir + '/lib/cache');

/**
 * Gets a publication’s configuration
 *
 * @module publication
 * @returns {Promise} Configuration object
 */
module.exports = async () => {
  try {
    const response = await cache.read(appConfig.config.path, appConfig.config.file);
    if (response) {
      return JSON.parse(response);
    }

    throw new Error('Can’t load configuration file');
  } catch (error) {
    console.error(error);
  }
};
