/**
 * Cache files to ensure endpoint isn’t slowed down by excessive requests to
 * third-party APIs.
 *
 * @module functions/cache
 */
const path = require('path');
const fs = require('fs-extra');
const {DateTime} = require('luxon');

const appConfig = require(__basedir + '/app/config.js');
const github = require(__basedir + '/app/functions/github.js');
const utils = require(__basedir + '/app/functions/utils.js');

/**
 * Gets a files modified date ()
 *
 * @private
 * @param {Strong} path Path to file in local cache
 * @returns {Number} Milliseconds since POSIX Epoch
 */
const getFileUpdatedDate = path => {
  const stats = fs.statSync(path);
  return stats.mtimeMs;
};

/**
 * Reads file from cache, fetching remote version if not found
 *
 * @param {Strong} remotePath Path to file on remote store
 * @param {Strong} cachePath Path to file in local cache
 * @returns {Object} Fetched file
 */
const fetchCache = async (remotePath, cachePath) => {
  const cacheFile = readCache(cachePath);

  // Check if file is cached
  let hasExpired;
  const filePath = path.join(appConfig.cache.dir, cachePath);
  const isCached = fs.existsSync(filePath);

  if (isCached) {
    let updatedDate = getFileUpdatedDate(filePath);
    updatedDate = DateTime.fromMillis(updatedDate).toFormat('X');

    let currentDate = Date.now();
    currentDate = DateTime.fromMillis(currentDate).toFormat('X');

    const expiredDate = Number(updatedDate) + Number(appConfig.cache['max-age']);
    hasExpired = currentDate > expiredDate;
  }

  // Fetch if no cache found or cache has expired
  if (!isCached || hasExpired) {
    remotePath = utils.normalizePath(remotePath);

    try {
      const remoteData = await github.getContents(remotePath);
      const freshData = remoteData.content;
      writeCache(cachePath, freshData);
      return freshData;
    } catch (error) {
      console.error(error);
    }
  }

  const cachedData = Buffer.from(cacheFile).toString('utf-8');
  return cachedData;
};

/**
 * Reads data from cache file
 *
 * @param {Strong} filePath Path to cache file
 * @returns {Object} Cache object
 */
const readCache = filePath => {
  filePath = path.join(appConfig.cache.dir, filePath);

  if (fs.existsSync(filePath)) {
    const cacheFile = fs.readFileSync(filePath);
    return cacheFile;
  }
};

/**
 * Writes data to cache file
 *
 * @param {Object} filePath Location to save cache file
 * @param {Object} fileData Cache object
 */
const writeCache = (filePath, fileData) => {
  filePath = path.join(appConfig.cache.dir, filePath);
  const pathToFile = path.parse(filePath).dir;

  // Create cache directory if it doesnt exist already
  if (!fs.existsSync(pathToFile)) {
    fs.mkdirSync(pathToFile, {recursive: true});
  }

  // Write data to disk
  fs.writeFile(filePath, fileData, error => {
    const fileName = path.basename(filePath);

    if (error) {
      throw new Error(`Could not cache ${fileName}`);
    }

    console.info(`Cached ${fileName}`);
  });
};

/**
 * Cleares the cache directory
 *
 * @param {Object} cacheDir Location to save cache directory
 */
const clearCache = cacheDir => {
  if (fs.existsSync(cacheDir)) {
    fs.removeSync(cacheDir);
  }

  console.info('Cache cleared');
};

module.exports = {
  clear: clearCache,
  fetch: fetchCache,
  read: readCache,
  write: writeCache
};
