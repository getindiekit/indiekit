/**
 * Store an action and associated changes, stored for later retrieval,
 * i.e. for updating or undelete a post.
 *
 * @module store
 */
const path = require('path');
const normalizeUrl = require('normalize-url');
const Store = require('data-store');

const config = require(process.env.PWD + '/app/config');

/**
 * Sets a record in store.
 *
 * @memberof store
 * @exports set
 * @param {Object} url URL activity relates to
 * @param {Object} data Data to store
 */
const set = (url, data) => {
  url = normalizeUrl(url);
  const key = Buffer.from(url).toString('base64');

  const store = new Store({
    path: path.join(config.data.dir, 'store.json')
  });
  store.set(key, data);
};

/**
 * Gets a record from store
 *
 * @memberof store
 * @exports get
 * @param {Object} url URL activity relates to
 * @return {Object} Store data
 */
const get = url => {
  url = normalizeUrl(url);
  const key = Buffer.from(url).toString('base64');

  const store = new Store({
    path: path.join(config.data.dir, 'store.json')
  });
  return store.get(key);
};

module.exports = {
  set,
  get
};
