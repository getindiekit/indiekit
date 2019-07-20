const path = require('path');
const {DateTime} = require('luxon');
const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');
const createCache = require(process.env.PWD + '/app/lib/cache/create');
const logger = require(process.env.PWD + '/app/logger');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Gets a files modified date ()
 *
 * @private
 * @param {String} path Path to file in local cache
 * @returns {Number} Milliseconds since POSIX Epoch
 */
const getFileUpdatedDate = path => {
  const stats = fs.statSync(path);
  return stats.mtimeMs;
};

/**
 * Reads a file in the cache, fetching from store if not found
 *
 * @memberof cache
 * @module read
 * @param {String} storePath Path to file in store
 * @param {String} cachePath Path to file in cache
 * @returns {Promise|Object} Fetched file object
 */
module.exports = async (storePath, cachePath) => {
  cachePath = path.join(config.cache.dir, cachePath);
  let cacheFile;
  let hasExpired;
  const isCached = fs.existsSync(cachePath);

  // Cache exists, check freshness
  if (isCached) {
    let updatedDate = getFileUpdatedDate(cachePath);
    updatedDate = DateTime.fromMillis(updatedDate).toFormat('X');

    let currentDate = Date.now();
    currentDate = DateTime.fromMillis(currentDate).toFormat('X');

    const expiredDate = Number(updatedDate) + Number(config.cache['max-age']);
    hasExpired = currentDate > expiredDate;
  }

  if (!isCached || hasExpired) {
    storePath = utils.normalizePath(storePath);

    try {
      const storeData = await store.github.getContents(storePath);
      if (storeData) {
        const freshData = storeData.data.content;
        createCache(cachePath, freshData);
        return freshData;
      }

      throw new Error(`Unable to load ${storePath} from store`);
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  // Cache exists, still fresh
  if (!hasExpired) {
    cacheFile = fs.readFileSync(cachePath);
    const cachedData = Buffer.from(cacheFile).toString('utf-8');
    return cachedData;
  }
};
