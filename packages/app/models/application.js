import fs from 'fs';
import {client} from '../config/database.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const data = await client.hgetall('application');
  const package_ = JSON.parse(fs.readFileSync('package.json'));

  const application = {
    name: data.name || 'IndieKit',
    version: package_.version,
    description: package_.description,
    repository: package_.repository,
    locale: data.locale || 'en',
    themeColor: data.themeColor || '#0000ee'
  };

  return application;
};

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const application = await getAll();
  return application[key];
};

/**
 * @param {string} values Values to insert
 * @returns {Promise|boolean} 0|1
 */
export const setAll = async values => {
  return client.hmset('application', values);
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 * @returns {Promise|boolean} 0|1
 */
export const set = async (key, value) => {
  return client.hset('application', key, value);
};
