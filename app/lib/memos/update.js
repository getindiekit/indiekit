const path = require('path');
const {DateTime} = require('luxon');
const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');
const readMemos = require(process.env.PWD + '/app/lib/memos/read');

/**
 * Updates memo (either by updating existing, or appending new)
 *
 * @memberof memos
 * @module update
 * @param {String} action Entry type
 * @param {Object} data Entry data
 */
module.exports = (action, data) => {
  const filePath = path.join(config.cache.dir, config.cache.memos);

  try {
    const memos = readMemos(filePath);

    // Construct entry
    let timestamp = Date.now();
    timestamp = DateTime.fromMillis(timestamp).toFormat('X');

    const entry = {
      timestamp,
      [action]: data
    };

    memos.push(entry);
    const json = JSON.stringify(memos, null, 2);
    fs.writeFileSync(filePath, json);
  } catch (error) {
    console.error(error);
    throw new Error(`Unable to update ${filePath}`);
  }
};
