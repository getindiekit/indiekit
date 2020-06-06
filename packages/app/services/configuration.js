import {Cache} from './cache.js';

/**
 * Get custom configuration file and cache for reuse
 *
 * @param {object} client Redis client
 * @param {string} url URL of custom configuration
 * @returns {Promise|object} Custom configuration object
 */
export const getCustomConfig = async (client, url) => {
  let customConfig = {};

  if (url) {
    try {
      const cache = new Cache(client);
      const cachedConfig = await cache.json('customConfig', url);
      customConfig = cachedConfig.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return customConfig;
};

/**
 * Get default configuration file
 *
 * @param {string} name Name of configuration
 * @returns {Promise|object} Default configuration object
 */
export const getDefaultConfig = async name => {
  const defaultConfig = await (
    await import(`@indiekit/config-${name}`) // eslint-disable-line node/no-unsupported-features/es-syntax
  ).default;

  return defaultConfig;
};

/**
 * Get merged custom and default configurations
 *
 * @param {object} customConfig Custom configuration
 * @param {object} defaultConfig Default configuration
 * @returns {object} Merged configuration
 */
export const getConfig = (customConfig, defaultConfig) => {
  // Merge configuration objects
  const config = {...defaultConfig, ...customConfig};

  // Combine post type arrays (leaving duplicate post types)
  const customPostTypes = customConfig['post-types'] || [];
  const defaultPostTypes = defaultConfig['post-types'] || [];
  const combinedPostTypes = [
    ...customPostTypes,
    ...defaultPostTypes
  ];

  // Merge duplicate post types
  const set = new Set();
  const mergedPostTypes = combinedPostTypes.filter(postType => {
    if (!set.has(postType.type)) {
      set.add(postType.type);
      return true;
    }

    return false;
  }, set);

  config['post-types'] = mergedPostTypes;

  return config;
};
