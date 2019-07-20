const fs = require('fs-extra');

const logger = require(process.env.PWD + '/app/logger');

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
    logger.info(`Deleted ${dir}`);
  }
};
