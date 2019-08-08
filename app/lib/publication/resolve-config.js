const path = require('path');
const _ = require('lodash');

const cache = require(process.env.PWD + '/app/lib/cache');
const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');

/**
 * Gets a publication’s configured post types, caches any referenced templates,
 * before combining them with default values set by application.
 *
 * @private
 * @param {String} pubPostTypes Post types configured by publication
 * @param {Object} defaultPostTypes Default post types
 * @returns {Promise} Post types object
 */
const resolvePostTypes = async (pubPostTypes, defaultPostTypes) => {
  const cachedTemplates = [];
  for (const key in pubPostTypes) {
    if (Object.prototype.hasOwnProperty.call(pubPostTypes, key)) {
      const pubPostType = pubPostTypes[key];
      // Only cache templates publisher has configured
      if (pubPostType.template) {
        const cacheTemplate = path.join('templates', `${key}.njk`);
        const cacheTemplatePath = path.join(config.cache.dir, cacheTemplate);
        cachedTemplates.push(
          cache.read(pubPostType.template, cacheTemplate)
        );

        // Update `template` value with location of cached template
        pubPostType.template = cacheTemplatePath;
      }
    }
  }

  // Wait for all templates to be cached
  await Promise.all(cachedTemplates);

  // Merge default and publication post types (with cached template paths)
  const resolvedPostTypes = _.merge(defaultPostTypes, pubPostTypes);

  return resolvedPostTypes;
};

/**
 * Gets a publication’s configuration and combines it with default values.
 *
 * @memberof publication
 * @module resolveConfig
 * @param {String} pubConfig Publication configuration
 * @param {Object} defaultConfig Default configuration
 * @returns {Promise} Resolved configuration object
 */
module.exports = async (pubConfig, defaultConfig = require('./defaults')) => {
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
    const resolvedPostTypes = await resolvePostTypes(pubPostTypes, defaultPostTypes);
    resolvedConfig['post-types'] = resolvedPostTypes;
  }

  return resolvedConfig;
};
