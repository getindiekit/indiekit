const path = require('path');

const appConfig = require(__basedir + '/app/config');
const {DateTime} = require('luxon');
const fs = require('fs-extra');

const historyFilePath = path.join(appConfig.cache.dir, appConfig.history.file);

/**
 * Creates empty history file
 */
const createHistory = () => {
  try {
    const history = {
      entries: []
    };
    const json = JSON.stringify(history, null, 2);
    fs.writeFileSync(historyFilePath, json);
  } catch (error) {
    throw new Error(`Unable to create ${historyFilePath}`);
  }
};

/**
 * Reads content of the history file
 *
 * @returns {Object} Configuration options
 */
const readHistory = async () => {
  const historyFileExists = fs.existsSync(historyFilePath);

  try {
    if (!historyFileExists) {
      createHistory();
    }

    const historyFile = fs.readFileSync(historyFilePath);
    return JSON.parse(historyFile);
  } catch (error) {
    throw new Error(`Unable to read ${historyFilePath}`);
  }
};

/**
 * Updates content of the history file by appending new entry
 *
 * @param {String} action Entry type
 * @param {Object} data Entry data
 */
const updateHistory = async (action, data) => {
  try {
    const history = await readHistory();

    // Construct entry
    let timestamp = Date.now();
    timestamp = DateTime.fromMillis(timestamp).toFormat('X');

    const entry = {
      timestamp,
      [action]: data
    };

    history.entries.push(entry);
    const json = JSON.stringify(history, null, 2);
    fs.writeFileSync(historyFilePath, json);
  } catch (error) {
    throw new Error(`Unable to update ${historyFilePath}`);
  }
};

module.exports = {
  create: createHistory,
  read: readHistory,
  update: updateHistory
};
