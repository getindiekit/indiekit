const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');

/**
 * Deletes the cache directory
 *
 * @memberof cache
 * @module delete
 * @param {Object} cacheDir Location to save cache directory
 */
module.exports = () => {
  if (fs.existsSync(config.cache.dir)) {
    fs.removeSync(config.cache.dir);
  }

  console.info('Cache deleted');
};
