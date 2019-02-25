const path = require('path');
const fs = require('fs-extra');
const {DateTime} = require('luxon');

const appConfig = require(__basedir + '/config.js');
const github = require(__basedir + '/lib/github');
const updateCache = require(__basedir + '/lib/cache/update');
const utils = require(__basedir + '/lib/utils');

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
 * Reads a file in the cache, fetching remote version if not found
 *
 * @memberof cache
 * @module read
 * @param {String} remotePath Path to file on remote store
 * @param {String} cachePath Path to file in local cache
 * @returns {Promise|Object} Fetched file object
 */
module.exports = async (remotePath, cachePath) => {
  cachePath = path.join(appConfig.cache.dir, cachePath);
  let cacheFile;
  let hasExpired;
  const isCached = fs.existsSync(cachePath);

  // Cache exists, check freshness
  if (isCached) {
    let updatedDate = getFileUpdatedDate(cachePath);
    updatedDate = DateTime.fromMillis(updatedDate).toFormat('X');

    let currentDate = Date.now();
    currentDate = DateTime.fromMillis(currentDate).toFormat('X');

    const expiredDate = Number(updatedDate) + Number(appConfig.cache['max-age']);
    hasExpired = currentDate > expiredDate;
  }

  // No cache exists, or existing cache has expired
  if (!isCached || hasExpired) {
    remotePath = utils.normalizePath(remotePath);

    try {
      const remoteData = await github.read(remotePath);
      const freshData = remoteData.content;
      updateCache(cachePath, freshData);
      return freshData;
    } catch (error) {
      console.error(error);
    }
  }

  // Cache exists, still fresh
  if (!hasExpired) {
    cacheFile = fs.readFileSync(cachePath);
    const cachedData = Buffer.from(cacheFile).toString('utf-8');
    return cachedData;
  }
};
