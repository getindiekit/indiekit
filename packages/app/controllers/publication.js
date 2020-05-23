import deepmerge from 'deepmerge';

import {read as settings} from './settings.js';
import categoriesService from '../services/categories.js';
import customConfigService from '../services/custom-config.js';
import defaultConfigService from '../services/default-config.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const read = async () => {
  // Get settings
  const {customConfigUrl, defaultConfigType} = await settings;

  // Combine custom and default configs
  const customConfig = await customConfigService(customConfigUrl);
  const defaultConfig = await defaultConfigService(defaultConfigType);
  const publication = deepmerge(customConfig, defaultConfig);
  publication.categories = await categoriesService(customConfig.categories);

  return publication;
};

/**
 * @returns {Promise|object} Public configuration object
 */
export const config = async () => {
  const config = await read();

  // Query supported vocabulary
  // https://indieweb.org/Micropub-extensions#Query_for_Supported_Vocabulary
  const postTypes = config['post-types'];
  config['post-types'] = Object.keys(postTypes).map(key => ({
    type: key,
    name: postTypes[key].name
  }));

  return config;
};
