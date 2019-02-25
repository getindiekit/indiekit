const fs = require('fs-extra');

/**
 * Deletes the cache directory
 *
 * @memberof cache
 * @module delete
 * @param {Object} cacheDir Location to save cache directory
 */
module.exports = cacheDir => {
  if (fs.existsSync(cacheDir)) {
    fs.removeSync(cacheDir);
  }

  console.info('Cache deleted');
};
