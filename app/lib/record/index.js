/**
 * Record of an action and associated changes, stored for later retrieval,
 * i.e. for updating or undelete a post.
 *
 * @module record
 */
const path = require('path');
const normalizeUrl = require('normalize-url');

const config = require(process.env.PWD + '/app/config');

const Store = require('data-store');

const store = new Store({
  path: path.join(config.data.dir, 'record.json')
});

/**
 * Sets a value.
 *
 * @memberof record
 * @exports set
 * @param {Object} url URL activity relates to
 * @param {Object} data Data to record
 */
const set = (url, data) => {
  url = normalizeUrl(url);
  const key = Buffer.from(url).toString('base64');

  store.set(key, data);
};

/**
 * Gets a record
 *
 * @memberof record
 * @exports get
 * @param {Object} url URL activity relates to
 * @return {Object} Record data
 */
const get = url => {
  url = normalizeUrl(url);
  const key = Buffer.from(url).toString('base64');

  return store.get(key);
};

module.exports = {
  set,
  get
};
