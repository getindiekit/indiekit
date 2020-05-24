import deepmerge from 'deepmerge';

import * as publicationModel from '../models/publication.js';
import categoriesService from '../services/categories.js';
import customConfigService from '../services/custom-config.js';
import defaultConfigService from '../services/default-config.js';

/**
 * @returns {Promise|object} Configuration object
 */
export const read = async () => {
  try {
    // Get saved publication values
    const data = await publicationModel.getAll();

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
      customConfigUrl,
      defaultConfigType,
      config
    };

    return publication;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @param {object} values Values to save
 * @returns {boolean} True if operation successful
 */
export async function write(values) {
  try {
    await publicationModel.setAll(values);
    return true;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * @returns {Promise|object} Public configuration object
 */
export const queryConfig = async () => {
  const {config} = await read();

  // Query supported vocabulary
  // https://indieweb.org/Micropub-extensions#Query_for_Supported_Vocabulary
  const postTypes = config['post-types'];
  config['post-types'] = Object.keys(postTypes).map(key => ({
    type: key,
    name: postTypes[key].name
  }));

  return config;
};
