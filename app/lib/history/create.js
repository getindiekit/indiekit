const path = require('path');
const fs = require('fs-extra');

const config = require(__basedir + '/config');

/**
 * Creates an empty history file
 *
 * @memberof history
 * @module create
 */
module.exports = () => {
  const filePath = path.join(config.cache.dir, config.cache.history);

  try {
    const history = {
      entries: []
    };
    const json = JSON.stringify(history, null, 2);
    fs.writeFileSync(filePath, json);
  } catch (error) {
    throw new Error(`Unable to create ${filePath}`);
  }
};
