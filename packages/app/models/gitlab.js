import {client} from '../config/database.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const data = await client.hgetall('gitlab');

  const gitlab = {
    instance: data.instance || 'https://gitlab.com',
    user: data.user,
    repo: data.repo,
    branch: data.branch || 'master',
    token: data.token
  };

  return gitlab;
};

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const gitlab = await getAll();
  return gitlab[key];
};

/**
 * @param {string} values Values to insert
 * @returns {Promise|boolean} 0|1
 */
export const setAll = async values => {
  return client.hmset('gitlab', values);
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 * @returns {Promise|boolean} 0|1
 */
export const set = async (key, value) => {
  return client.hset('gitlab', key, value);
};
