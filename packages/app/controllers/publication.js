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
      config,
      customConfigUrl,
      defaultConfigType,
      hostId: data.hostId || 'github'
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
