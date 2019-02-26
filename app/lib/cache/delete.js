const fs = require('fs-extra');

const appConfig = require(__basedir + '/config.js');

/**
 * Deletes the cache directory
 *
 * @memberof cache
 * @module delete
 * @param {Object} cacheDir Location to save cache directory
 */
module.exports = () => {
  if (fs.existsSync(appConfig.cache.dir)) {
    fs.removeSync(appConfig.cache.dir);
  }

  console.info('Cache deleted');
};
