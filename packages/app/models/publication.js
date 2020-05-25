import deepmerge from 'deepmerge';
import categoriesService from '../services/categories.js';
import customConfigService from '../services/custom-config.js';
import defaultConfigService from '../services/default-config.js';
import {client} from '../config/database.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const getAll = async () => {
  const data = await client.hgetall('publication');

  // Get custom config
  const customConfigUrl = data.customConfigUrl || false;
  const customConfig = await customConfigService(customConfigUrl);

  // Get default config
  const defaultConfigType = data.defaultConfigType || 'jekyll';
  const defaultConfig = await defaultConfigService(defaultConfigType);

  // Combine config from custom and default values
  const config = deepmerge(customConfig, defaultConfig);
  config.categories = await categoriesService(customConfig.categories);

  // Publication settings
  const publication = {
    config,
    customConfigUrl,
    defaultConfigType,
    hostId: data.hostId
  };

  return publication;
};

/**
 * @param {string} key Database key
 * @returns {Promise|object} Configuration object
 */
export const get = async key => {
  const publication = await getAll();
  return publication[key];
};

/**
 * @param {string} values Values to insert
 * @returns {Promise|boolean} 0|1
 */
export const setAll = async values => {
  return client.hmset('publication', values);
};

/**
 * @param {string} key Key to lookup
 * @param {string} value Value to insert
 * @returns {Promise|boolean} 0|1
 */
export const set = async (key, value) => {
  return client.hset('publication', key, value);
};
