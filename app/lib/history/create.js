const fs = require('fs-extra');

/**
 * Creates an empty history file
 *
 * @memberof history
 * @module create
 * @param {String} path Path to history file
 */
module.exports = path => {
  console.log('Create history file at:', path);
  try {
    const history = {
      entries: []
    };
    const json = JSON.stringify(history, null, 2);
    fs.writeFileSync(path, json);
  } catch (error) {
    throw new Error(`Unable to create ${path}`);
  }
};
