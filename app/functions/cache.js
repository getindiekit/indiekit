const fs = require('fs');
const path = require('path');
const {DateTime} = require('luxon');

const appConfig = require(__basedir + '/app/config.js');
const github = require(__basedir + '/app/functions/github.js');
const utils = require(__basedir + '/app/functions/utils.js');

const getFileUpdatedDate = path => {
  const stats = fs.statSync(path);
  return stats.mtimeMs;
};

/**
 * Reads file from cache, fetching remote version if not found
 * TODO: Expire cache and fetch again after a certain time limit
 *
 * @param {Strong} remotePath Path to file on remote store
 * @param {Strong} cachePath Path to file in local cache
 * @returns {Object} Fetched file
 */
exports.fetchFile = async function (remotePath, cachePath) {
  const cacheFile = module.exports.readFromCache(cachePath);

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
    const remoteData = await github.getContents(remotePath);

    try {
      module.exports.writeToCache(cachePath, remoteData);
      return remoteData;
    } catch (error) {
      console.error('cache.fetchFile', error);
    }

    return Buffer.from(cacheFile).toString('utf-8');
  }
};

/**
 * Reads data from cache file
 *
 * @param {Strong} filePath Path to cache file
 * @returns {Object} Cache object
 */
exports.readFromCache = function (filePath) {
  filePath = path.join(appConfig.cache.dir, filePath);

  if (fs.existsSync(filePath)) {
    const cacheFile = fs.readFileSync(filePath);
    return cacheFile;
  }
};

/**
 * Saves data to cache file
 *
 * @param {Object} filePath Location to save cache file
 * @param {Object} fileData Cache object
 */
exports.writeToCache = function (filePath, fileData) {
  filePath = path.join(appConfig.cache.dir, filePath);
  const pathToFile = path.parse(filePath).dir;

  // Create cache directory if it doesnt exist already
  if (!fs.existsSync(pathToFile)) {
    fs.mkdirSync(pathToFile, {recursive: true});
  }

  // Write data to disk
  fs.writeFile(filePath, fileData, error => {
    if (error) {
      throw error;
    }

    console.log(`Cached data written to ${filePath}`);
  });
};
