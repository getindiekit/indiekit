const path = require('path');
const normalizeUrl = require('normalize-url');
const Store = require('data-store');

const config = require(process.env.PWD + '/app/config');

/**
 * Sets a record in store.
 *
 * @exports set
 * @param {Object} url URL activity relates to
 * @param {Object} data Data to store
 * @param {String} storeName Name of data store
 */
const set = (url, data, storeName = 'posts') => {
  url = normalizeUrl(url);
  const key = Buffer.from(url).toString('base64');

  const store = new Store({
    path: path.join(config.data.dir, `${storeName}.json`)
  });
  store.set(key, data);
};

/**
 * Gets a record from store.
 *
 * @exports get
 * @param {Object} url URL activity relates to
 * @param {String} storeName Name of data store
 * @return {Object} Store data
 */
const get = (url, storeName = 'posts') => {
  url = normalizeUrl(url);
  const key = Buffer.from(url).toString('base64');

  const store = new Store({
    path: path.join(config.data.dir, `${storeName}.json`)
  });
  return store.get(key);
};

/**
 * Gets all records from a store.
 *
 * @exports getRecords
 * @param {String} storeName Name of data store
 * @param {String} property Property to return
 * @returns {Object} List of records
 */
const getRecords = (storeName, property) => {
  const storePath = path.join(config.data.dir, `${storeName}.json`);
  const recordStore = require(storePath);
  const records = [];

  for (const key in recordStore) {
    if (Object.prototype.hasOwnProperty.call(recordStore, key)) {
      const record = recordStore[key][property] || recordStore[key];
      records.push(record);
    }
  }

  return records;
};

module.exports = {
  set,
  get,
  getRecords
};
