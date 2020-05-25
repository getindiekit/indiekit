import {client} from '../config/database.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const data = await client.hgetall('github');

  const github = {
    user: data.user,
    repo: data.repo,
    branch: data.branch || 'master',
    token: data.token
  };

  return github;
};

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const github = await getAll();
  return github[key];
};

/**
 * @param {string} values Values to insert
 * @returns {Promise|boolean} 0|1
 */
export const setAll = async values => {
  return client.hmset('github', values);
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 * @returns {Promise|boolean} 0|1
 */
export const set = async (key, value) => {
  return client.hset('github', key, value);
};
