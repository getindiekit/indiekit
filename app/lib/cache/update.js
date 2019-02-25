const path = require('path');
const fs = require('fs-extra');

/**
 * Updates a file in the cache
 *
 * @memberof cache
 * @module update
 * @param {Object} filePath Location to cache file
 * @param {Object} fileData Cache object to update
 */
module.exports = (filePath, fileData) => {
  const pathToFile = path.parse(filePath).dir;

  // Create cache directory if it doesnt exist already
  if (!fs.existsSync(pathToFile)) {
    fs.mkdirSync(pathToFile, {
      recursive: true
    });
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
