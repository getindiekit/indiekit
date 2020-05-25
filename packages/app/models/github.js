import {client} from '../config/database.js';

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const github = await getAll();
  return github[key];
};

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const github = await client.hgetall('github');
  return github;
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 * @returns {Promise|boolean} 0|1
 */
export const set = async (key, value) => {
  return client.hset('github', key, value);
};

/**
 * @param {string} values Values to insert
 * @returns {Promise|boolean} 0|1
 */
export const setAll = async values => {
  return client.hmset('github', values);
};
