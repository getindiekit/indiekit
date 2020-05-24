import {client} from '../config/db.js';

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const application = await getAll();
  return application[key];
};

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const application = await client.hgetall('application');
  return application;
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 */
export const set = async (key, value) => {
  return client.hset('application', key, value);
};

/**
 * @param {string} values Values to insert
 */
export const setAll = async values => {
  return client.hmset('application', values);
};
