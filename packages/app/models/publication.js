import categoriesService from '../services/categories.js';
import customConfigService from '../services/custom-config.js';
import defaultConfigService from '../services/default-config.js';
import mergeConfigsService from '../services/merge-configs.js';
import Model from './model.js';

export class PublicationModel extends Model {
  constructor(keyId) {
    super(keyId);
    this.keyId = 'publication';
  }

  async getAll() {
    try {
      const data = await super.getAll();

      // Get custom config
      const customConfigUrl = data.customConfigUrl || false;
      const customConfig = await customConfigService(this.client, customConfigUrl);

      // Get default config
      const defaultConfigType = data.defaultConfigType || 'jekyll';
      const defaultConfig = await defaultConfigService(defaultConfigType);

      // Combine config from custom and default values
      const config = mergeConfigsService(customConfig, defaultConfig);

      // Publication categories
      config.categories = await categoriesService(this.client, customConfig.categories);

      // Publication settings
      const publication = {
        config,
        customConfigUrl,
        defaultConfigType,
        me: data.me || null,
        hostId: data.hostId || null
      };

      return publication;
    } catch (error) {
      throw new Error(error);
    }
  }
}
