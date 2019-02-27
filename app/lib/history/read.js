const path = require('path');
const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');
const createHistory = require(process.env.PWD + '/app/lib/history/create');

/**
 * Reads contents of the history file
 *
 * @memberof history
 * @module read
 * @returns {Object} Configuration options
 */
module.exports = () => {
  const filePath = path.join(config.cache.dir, config.cache.history);
  const isCached = fs.existsSync(filePath);

  if (!isCached) {
    console.info('Creating new history file');
    createHistory();
  }

  try {
    console.info(`Reading history from ${filePath}`);
    const historyFile = fs.readFileSync(filePath);
    return JSON.parse(historyFile);
  } catch (error) {
    throw new Error(`Unable to read ${filePath}`);
  }
};
