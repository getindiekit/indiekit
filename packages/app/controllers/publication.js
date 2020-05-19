import deepmerge from 'deepmerge';

import * as settingsController from '../controllers/settings.js';
import categoriesService from '../services/categories.js';
import customConfigService from '../services/custom-config.js';
import defaultConfigService from '../services/default-config.js';

/**
 * @exports read
 * @returns {Promise|Object} Configuration object
 */
export const read = async () => {
  // Get settings
  const settings = await settingsController.read();
  const {customConfigUrl, defaultConfigType} = settings;

  // Combine custom and default configs
  const customConfig = await customConfigService(customConfigUrl);
  const defaultConfig = await defaultConfigService(defaultConfigType);
  const publication = deepmerge(customConfig, defaultConfig);
  publication.categories = await categoriesService(customConfig.categories);

  // Return publication config
  return publication;
};

/**
 * @exports public
 * @returns {Promise|Object} Public configuration object
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

  // Return public publication config
  return config;
};
