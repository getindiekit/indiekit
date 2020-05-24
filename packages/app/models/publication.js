import {client} from '../config/db.js';

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const settings = await getAll();
  return settings[key];
};

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const settings = await client.hgetall('publication');
  return settings;
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 */
export const set = async (key, value) => {
  client.hset('publication', key, value);
};

/**
 * @param {string} values Values to insert
 */
export const setAll = async values => {
  return client.hmset('publication', values);
};
