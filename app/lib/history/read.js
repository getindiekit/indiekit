const path = require('path');
const fs = require('fs-extra');

const appConfig = require(__basedir + '/config');
const createHistory = require(__basedir + '/lib/history/create');

/**
 * Reads contents of the history file
 *
 * @memberof history
 * @module read
 * @returns {Object} Configuration options
 */
module.exports = () => {
  const filePath = path.join(appConfig.cache.dir, appConfig.history.file);
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
