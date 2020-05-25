import {client} from '../config/database.js';

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const gitlab = await getAll();
  return gitlab[key];
};

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const gitlab = await client.hgetall('gitlab');
  return gitlab;
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 * @returns {Promise|boolean} 0|1
 */
export const set = async (key, value) => {
  return client.hset('gitlab', key, value);
};

/**
 * @param {string} values Values to insert
 * @returns {Promise|boolean} 0|1
 */
export const setAll = async values => {
  return client.hmset('gitlab', values);
};
