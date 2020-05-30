import deepmerge from 'deepmerge';
import categoriesService from '../services/categories.js';
import customConfigService from '../services/custom-config.js';
import defaultConfigService from '../services/default-config.js';
import Model from './model.js';

export class PublicationModel extends Model {
  constructor(keyId) {
    super(keyId);
    this.keyId = 'publication';
  }

  async getAll() {
    const data = await super.getAll();

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
      me: data.me || null,
      hostId: data.hostId || null
    };

    return publication;
  }
}
