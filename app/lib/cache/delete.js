const fs = require('fs-extra');

/**
 * Deletes the cache directory
 *
 * @memberof cache
 * @module delete
 * @param {Object} dir Location of cache directory
 */
module.exports = dir => {
  if (fs.existsSync(dir)) {
    fs.removeSync(dir);
    console.info(`Deleted ${dir}`);
  }
};
