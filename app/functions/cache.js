const fs = require('fs');
const path = require('path');

const appConfig = require(__basedir + '/app/config.js');
const github = require(__basedir + '/app/functions/github.js');
const utils = require(__basedir + '/app/functions/utils.js');

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
  const {lastFetched} = cacheFile;

  // Only fetch new mentions in production
  if (!lastFetched) {
    remotePath = utils.normalizePath(remotePath);
    const remoteData = await github.getContents(remotePath);

    if (remoteData) {
      const cacheFile = {
        lastFetched: new Date().toISOString(),
        data: JSON.parse(remoteData)
      };

      module.exports.writeToCache(cachePath, cacheFile);
      return cacheFile.data;
    }
  }

  return cacheFile.data;
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
    return JSON.parse(cacheFile);
  }

  return {
    lastFetched: null,
    data: []
  };
};

/**
 * Saves data to cache file
 *
 * @param {Object} filePath Location to save cache file
 * @param {Object} data Cache object
 */
exports.writeToCache = function (filePath, data) {
  filePath = path.join(appConfig.cache.dir, filePath);
  const fileContent = JSON.stringify(data, null, 2);

  // Create cache directory if it doesnt exist already
  if (!fs.existsSync(appConfig.cache.dir)) {
    fs.mkdirSync(appConfig.cache.dir);
  }

  // Write data to disk
  fs.writeFile(filePath, fileContent, error => {
    if (error) {
      throw error;
    }

    console.log(`Cached data written to ${filePath}`);
  });
};
