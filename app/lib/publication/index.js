/* eslint no-await-in-loop: warn */
const path = require('path');
const _ = require('lodash');

const cache = require(process.env.PWD + '/app/lib/cache');
const config = require(process.env.PWD + '/app/config');
const appConfig = require('./defaults');

/**
 * Gets a publication’s configuration and combines it with default values set by
 * application.
 *
 * @module publication
 * @returns {Promise} Configuration object
 */
module.exports = async () => {
  // If no configuration provided, use application defaults
  if (!config['pub-config']) {
    console.info('No configuration provided. Using app defaults.');
    return appConfig;
  }

  try {
    // Fetch configuration from store and cache
    let pubConfig = await cache.read(config['pub-config'], config.cache.config);

    // If no configuration found in store, use application defaults
    if (pubConfig) {
      pubConfig = JSON.parse(pubConfig);
    } else {
      return appConfig;
    }

    // Merge store configuration with application defaults
    const newConfig = {...appConfig, ...pubConfig};

    // Fetch templates from store and cache
    let newPostTypes;
    const appPostTypes = appConfig['post-types'];
    const pubPostTypes = pubConfig['post-types'];

    if (pubPostTypes) {
      for (const key in pubPostTypes) {
        if (Object.prototype.hasOwnProperty.call(pubPostTypes, key)) {
          const postType = pubPostTypes[key];
          const cacheTemplate = path.join('templates', `${postType.type}.njk`);
          const cacheTemplatePath = path.join(config.cache.dir, cacheTemplate);
          await cache.read(postType.path.template, cacheTemplate);

          // Update `template` value with location of cached template
          postType.path.template = cacheTemplatePath;
        }
      }

      // Merge default and publication post types (with cached template paths)
      newPostTypes = _.unionBy(pubPostTypes, appPostTypes, 'type');

      // Update combined configuration with new post type values
      newConfig['post-types'] = newPostTypes;
    }

    return newConfig;
  } catch (error) {
    console.error(error);
  }
};
