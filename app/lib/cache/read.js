const path = require('path');
const {DateTime} = require('luxon');
const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');
const createCache = require(process.env.PWD + '/app/lib/cache/create');
const github = require(process.env.PWD + '/app/lib/github');
const logger = require(process.env.PWD + '/app/logger');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Gets a file’s modified date
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
 * Reads a file in the cache, fetching from GitHub if not found
 *
 * @memberof cache
 * @module read
 * @param {String} repoPath Path to file in GitHub repo
 * @param {String} cachePath Path to file in cache
 * @returns {Promise|Object} Fetched file object
 */
module.exports = async (repoPath, cachePath) => {
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
    repoPath = utils.normalizePath(repoPath);

    try {
      const repoData = await github.getContents(repoPath);
      const freshData = repoData.data.content;
      createCache(cachePath, freshData);
      return freshData;
    } catch (error) {
      logger.error('cache.read', {error});
      throw new Error(error.message);
    }
  }

  // Cache exists, still fresh
  if (!hasExpired) {
    cacheFile = fs.readFileSync(cachePath);
    const cachedData = Buffer.from(cacheFile).toString('utf-8');
    return cachedData;
  }
};
