import deepmerge from 'deepmerge';

import * as appModel from '../models/app.js';
import categoriesService from '../services/categories.js';
import customConfigService from '../services/custom-config.js';
import defaultConfigService from '../services/default-config.js';

/**
 * @exports publicationController
 * @param {String} customConfig Custom configuration
  * @param {String} defaultConfig Default configuration
 * @returns {Promise|Object} Configuration object
 */
export default async () => {
  // Custom config
  const customConfigUrl = await appModel.get('customConfigUrl');
  const customConfig = await customConfigService(customConfigUrl);

  // Default config
  const defaultConfigType = await appModel.get('defaultConfigType');
  const defaultConfig = await defaultConfigService(defaultConfigType);

  // Return merged config for publication
  const publication = deepmerge(customConfig, defaultConfig);
  publication.categories = await categoriesService(customConfig.categories);

  return publication;
};
