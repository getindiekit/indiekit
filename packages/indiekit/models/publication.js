import {getCategories} from '../services/categories.js';
import {getCustomConfig, getDefaultConfig, getConfig} from '../services/configuration.js';
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
      const customConfig = await getCustomConfig(this.client, customConfigUrl);

      // Get default config
      const defaultConfigType = data.defaultConfigType || 'jekyll';
      const defaultConfig = await getDefaultConfig(defaultConfigType);

      // Combine config from custom and default values
      const config = getConfig(customConfig, defaultConfig);

      // Publication categories
      config.categories = await getCategories(this.client, customConfig.categories);

      // Publication settings
      const publication = {
        config,
        customConfigUrl,
        defaultConfigType,
        storeId: data.storeId || 'github',
        me: data.me || null
      };

      return publication;
    } catch (error) {
      throw new Error(error);
    }
  }
}
