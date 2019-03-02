/* eslint no-await-in-loop: warn */
const path = require('path');
const _ = require('lodash');

const cache = require(process.env.PWD + '/app/lib/cache');
const config = require(process.env.PWD + '/app/config');
const defaults = require('./defaults');

/**
 * Gets a publication’s configuration file and combines it with defaults values
 * set by the application.
 *
 * @module publication
 * @returns {Promise} Configuration object
 */
module.exports = async () => {
  try {
    // Fetch and cache remote configuration
    let publicationConfig = await cache.read(config['publication-config'], config.cache.config);
    if (publicationConfig) {
      publicationConfig = JSON.parse(publicationConfig);
    }

    // Merge remote configuration with application defaults
    const combinedConfig = {...defaults, ...publicationConfig};

    // Fetch and cache remote template files
    let combinedPostTypes;
    const defaultPostTypes = defaults['post-types'];
    const publicationPostTypes = publicationConfig['post-types'];

    if (publicationPostTypes) {
      for (const key in publicationPostTypes) {
        if (Object.prototype.hasOwnProperty.call(publicationPostTypes, key)) {
          const postType = publicationPostTypes[key];
          const cacheTemplate = path.join('templates', `${postType.type}.njk`);
          const cacheTemplatePath = path.join(config.cache.dir, cacheTemplate);
          await cache.read(postType.path.template, cacheTemplate);

          // Update `template` value with location of cached template file
          postType.path.template = cacheTemplatePath;
        }
      }

      // Merge default post types with remote post types (with cached template paths)
      combinedPostTypes = _.unionBy(publicationPostTypes, defaultPostTypes, 'type');

      // Update combined configuration with new post type values
      combinedConfig['post-types'] = combinedPostTypes;
    }

    return combinedConfig;
  } catch (error) {
    console.error(error);
  }
};
