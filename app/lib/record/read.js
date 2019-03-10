const path = require('path');

const config = require(process.env.PWD + '/app/config');

/**
 * Reads a record
 *
 * @memberof record
 * @module read
 * @param {Object} url URL of post
 * @return {Object} Memo
 */
module.exports = url => {
  const recordName = Buffer.from(url).toString('base64');
  let record = path.join(config.data.dir, `${recordName}.json`);
  record = require(record) || {};

  return record;
};
