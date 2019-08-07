/* eslint no-await-in-loop: warn */
const path = require('path');
const _ = require('lodash');

const {IndieKitError} = require(process.env.PWD + '/app/errors');
const cache = require(process.env.PWD + '/app/lib/cache');
const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');

/**
 * Gets a publication’s configuration and combines it with default values set by
 * application.
 *
 * @memberof publication
 * @module resolveConfig
 * @param {String} configPath Path to publication configuration
 * @param {Object} defaultConfig Default configuration
 * @returns {Promise} Configuration object
 */
module.exports = async (configPath, defaultConfig = require('./defaults')) => {
  // If no configuration provided, use application defaults
  if (!configPath) {
    logger.info('publication.resolveConfig: No configuration provided. Using defaults', {defaultConfig});
    return defaultConfig;
  }

  // Fetch publisher configuration from store and cache
  let pubConfig = await cache.read(configPath, 'config.json').catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });
  pubConfig = JSON.parse(pubConfig);

  // If no configuration found in store, use application defaults
  if (!pubConfig) {
    logger.info('publication.resolveConfig: Configuration not found. Using defaults', {defaultConfig});
    return defaultConfig;
  }

  // Merge publisher configuration with application defaults
  const newConfig = _.merge(defaultConfig, pubConfig);

  // Fetch publisher post type templates from store and cache
  let newPostTypes;
  const appPostTypes = defaultConfig['post-types'];
  const pubPostTypes = pubConfig['post-types'];

  if (pubPostTypes) {
    const cacheTemplates = [];
    for (const key in pubPostTypes) {
      if (Object.prototype.hasOwnProperty.call(pubPostTypes, key)) {
        const pubPostType = pubPostTypes[key];
        // Only cache templates publisher has configured
        if (pubPostType.template) {
          const cacheTemplate = path.join('templates', `${key}.njk`);
          const cacheTemplatePath = path.join(config.cache.dir, cacheTemplate);
          cacheTemplates.push(
            cache.read(pubPostType.template, cacheTemplate)
          );

          // Update `template` value with location of cached template
          pubPostType.template = cacheTemplatePath;
        }
      }
    }

    // Wait for all templates to be cached
    await Promise.all(cacheTemplates);

    // Merge default and publication post types (with cached template paths)
    newPostTypes = _.merge(appPostTypes, pubPostTypes);

    // Update combined configuration with new post type values
    newConfig['post-types'] = newPostTypes;
  }

  logger.info('publication.resolveConfig, resolved', {newConfig});
  return newConfig;
};
