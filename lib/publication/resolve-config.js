const _ = require('lodash');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const logger = require(process.env.PWD + '/lib/logger');
const defaults = require('./defaults');
const getFiles = require('./get-files');

/**
 * Gets a publication’s configured post types, caches any referenced templates,
 * before combining them with default values set by application.
 *
 * @private
 * @function resolvePostTypes
 * @param {String} pubPostTypes Post types configured by publication
 * @param {Object} defaultPostTypes Default post types
 * @returns {Promise} Post types object
 */
const resolvePostTypes = async (pubPostTypes, defaultPostTypes) => {
  try {
    // Error if `post-types` is an array
    if (Array.isArray(pubPostTypes)) {
      throw new TypeError('`post-types` should be an object');
    }

    // Cache configured templates
    const cachedTemplates = [];
    for (const key in pubPostTypes) {
      if (typeof pubPostTypes[key] === 'object') {
        const pubPostType = pubPostTypes[key];
        if (pubPostType.template) {
          cachedTemplates.push(
            getFiles(pubPostType.template)
          );

          // Update `template` with `cacheKey` value
          pubPostType.template = {
            cacheKey: pubPostType.template
          };
        }
      } else {
        throw new TypeError('Post type should be an object');
      }
    }

    // Wait for all templates to be cached
    await Promise.all(cachedTemplates);

    // Merge default and publication post types
    const resolvedPostTypes = _.merge(defaultPostTypes, pubPostTypes);

    return resolvedPostTypes;
  } catch (error) {
    throw new TypeError(error.message);
  }
};

/**
 * Gets a publication’s configuration and combines it with default values.
 *
 * @exports resolveConfig
 * @param {String} pubConfig Publication configuration
 * @param {Object} defaultConfig Default configuration
 * @returns {Promise} Resolved configuration object
 */
module.exports = async (pubConfig, defaultConfig = defaults) => {
  try {
    // Return default configuration if provided value not found
    if (!pubConfig) {
      logger.info('Configuration not found. Using defaults');

      return defaultConfig;
    }

    // Merge publisher configuration with defaults
    const resolvedConfig = _.merge(defaultConfig, pubConfig);

    // Merge publisher post types (referencing cached templates) with defaults
    const pubPostTypes = pubConfig['post-types'];
    if (pubPostTypes) {
      const defaultPostTypes = defaultConfig['post-types'];
      const resolvedPostTypes = await resolvePostTypes(pubPostTypes, defaultPostTypes).catch(error => {
        throw new Error(error.message);
      });
      resolvedConfig['post-types'] = resolvedPostTypes;
    }

    return resolvedConfig;
  } catch (error) {
    throw new IndieKitError({
      error: 'Invalid config',
      error_description: error.message,
      error_uri: 'https://paulrobertlloyd.github.io/indiekit/config#post-types'
    });
  }
};
