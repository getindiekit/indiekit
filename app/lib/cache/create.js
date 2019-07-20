const path = require('path');
const fs = require('fs-extra');

const logger = require(process.env.PWD + '/app/logger');

/**
 * Creates a new file in the cache, populating it with specified data
 *
 * @memberof cache
 * @module update
 * @param {Object} filePath Location to cache file
 * @param {Object} fileData Data to write to file
 */
module.exports = (filePath, fileData) => {
  const pathToFile = path.parse(filePath).dir;

  // Create cache directory if it doesnt exist already
  if (!fs.existsSync(pathToFile)) {
    fs.mkdirSync(pathToFile, {
      recursive: true
    });

    logger.info(`Created ${pathToFile}`);
  }

  // Write data to disk
  fs.writeFile(filePath, fileData, error => {
    if (error) {
      throw error;
    }

    logger.info(`Cached ${filePath}`);
  });
};
