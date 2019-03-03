const path = require('path');
const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');
const createMemos = require(process.env.PWD + '/app/lib/memos/create');

/**
 * Reads memo
 *
 * @memberof memos
 * @module read
 * @returns {Object} Configuration options
 */
module.exports = () => {
  const filePath = path.join(config.cache.dir, config.cache.memos);
  const isCached = fs.existsSync(filePath);

  if (!isCached) {
    console.info('Creating new memos file');
    createMemos();
  }

  try {
    console.info(`Reading memos from ${filePath}`);
    const memos = fs.readFileSync(filePath);
    return JSON.parse(memos);
  } catch (error) {
    throw new Error(`Unable to read ${filePath}`);
  }
};
