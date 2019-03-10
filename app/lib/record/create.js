const path = require('path');
const Store = require('data-store');

const config = require(process.env.PWD + '/app/config');

/**
 * Creates a new record
 *
 * @memberof record
 * @module create
 * @param {Object} url URL activity relates to
 * @param {Object} data Activity data to record
 */
module.exports = (url, data) => {
  const recordName = Buffer.from(url).toString('base64');
  const record = new Store({
    path: path.join(config.data.dir, `${recordName}.json`)
  });

  record.set(data);
};
