import {client} from '../config/db.js';

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const publication = await getAll();
  return publication[key];
};

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const publication = await client.hgetall('publication');
  return publication;
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 * @returns {Promise|boolean} 0|1
 */
export const set = async (key, value) => {
  return client.hset('publication', key, value);
};

/**
 * @param {string} values Values to insert
 * @returns {Promise|boolean} 0|1
 */
export const setAll = async values => {
  return client.hmset('publication', values);
};
