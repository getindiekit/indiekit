const fs = require('fs-extra');

const createHistory = require(__basedir + '/lib/history/create');

/**
 * Reads contents of the history file
 *
 * @memberof history
 * @module read
 * @param {String} path Path to history file
 * @returns {Object} Configuration options
 */
module.exports = path => {
  const isCached = fs.existsSync(path);

  if (!isCached) {
    createHistory(path);
  }

  try {
    const historyFile = fs.readFileSync(path);
    return JSON.parse(historyFile);
  } catch (error) {
    throw new Error(`Unable to read ${path}`);
  }
};
