const path = require('path');
const fs = require('fs-extra');
const {DateTime} = require('luxon');

const config = require(__basedir + '/config');
const github = require(__basedir + '/lib/github');
const createCache = require(__basedir + '/lib/cache/create');
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
    console.info('Fetching remote data to populate stale/missing cache');
    console.log('remotePth', remotePath);
    remotePath = utils.normalizePath(remotePath);

    try {
      const remoteData = await github.getContents(remotePath);
      const freshData = remoteData.data.content;
      createCache(cachePath, freshData);
      return freshData;
    } catch (error) {
      console.error(error);
    }
  }

  // Cache exists, still fresh
  if (!hasExpired) {
    console.info(`Reading cache from ${cachePath}`);
    cacheFile = fs.readFileSync(cachePath);
    const cachedData = Buffer.from(cacheFile).toString('utf-8');
    return cachedData;
  }
};
