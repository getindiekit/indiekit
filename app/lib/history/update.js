const path = require('path');
const {DateTime} = require('luxon');
const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');
const readHistory = require(process.env.PWD + '/app/lib/history/read');

/**
 * Updates contents of history file by appending new entry
 *
 * @memberof history
 * @module update
 * @param {String} action Entry type
 * @param {Object} data Entry data
 */
module.exports = (action, data) => {
  const filePath = path.join(config.cache.dir, config.cache.history);

  try {
    const history = readHistory(filePath);

    // Construct entry
    let timestamp = Date.now();
    timestamp = DateTime.fromMillis(timestamp).toFormat('X');

    const entry = {
      timestamp,
      [action]: data
    };

    history.entries.push(entry);
    const json = JSON.stringify(history, null, 2);
    fs.writeFileSync(filePath, json);
  } catch (error) {
    console.error(error);
    throw new Error(`Unable to update ${filePath}`);
  }
};
