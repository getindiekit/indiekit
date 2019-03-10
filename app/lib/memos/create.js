const path = require('path');
const {DateTime} = require('luxon');
const Store = require('data-store');

const config = require(process.env.PWD + '/app/config');

/**
 * Creates a new memo
 *
 * @memberof memos
 * @module create
 * @param {Object} record Memo record
 */
module.exports = record => {
  const date = Date.now();
  const timestamp = DateTime.fromMillis(date).toFormat('X');
  const memoStore = new Store({
    path: path.join(config.cache.dir, 'memos.json')
  });

  memoStore.set(timestamp, record);
};
