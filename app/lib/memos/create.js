const path = require('path');
const fs = require('fs-extra');

const config = require(process.env.PWD + '/app/config');

/**
 * Creates memos file
 *
 * @memberof memos
 * @module create
 */
module.exports = () => {
  const filePath = path.join(config.cache.dir, config.cache.memos);

  try {
    const memos = [];
    const json = JSON.stringify(memos, null, 2);
    fs.writeFileSync(filePath, json);
  } catch (error) {
    throw new Error(`Unable to create ${filePath}`);
  }
};
