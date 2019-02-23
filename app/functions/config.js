const appConfig = require(__basedir + '/app/config');
const cache = require(__basedir + '/app/functions/cache');

/**
 * Gets a publication’s configuration
 *
 * @returns {Object} Configuration options
 */
module.exports = async () => {
  try {
    const response = await cache.fetch(appConfig.config.path, appConfig.config.file);
    if (response) {
      return JSON.parse(response);
    }

    throw new Error('Can’t load configuration file');
  } catch (error) {
    console.error(error);
  }
};
