const path = require('path');

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
      console.info('Remote has configuration');
      publicationConfig = JSON.parse(publicationConfig);
    }

    // Merge remote configuration with application defaults
    const combinedConfig = {...defaults, ...publicationConfig};

    // Fetch and cache remote template files
    let combinedPostTypes;
    const defaultPostTypes = defaults['post-types'][0];
    const publicationPostTypes = publicationConfig['post-types'][0];

    if (publicationPostTypes) {
      console.info('Remote has configured post types');
      // @todo Make asynchronous
      for (const key in publicationPostTypes) {
        if (Object.prototype.hasOwnProperty.call(publicationPostTypes, key)) {
          const postType = publicationPostTypes[key];
          const publicationTemplate = postType.template;
          const cacheTemplate = path.join('templates', `${key}.njk`);
          const cacheTemplatePath = path.join(config.cache.dir, cacheTemplate);
          await cache.read(publicationTemplate, cacheTemplate);

          // Update `template` value with location of cached template file
          postType.template = cacheTemplatePath;
        }
      }

      // Merge default post types with remote post types (with cached template paths)
      combinedPostTypes = {...defaultPostTypes, ...publicationPostTypes};

      // Update combined configuration with new post type values
      combinedConfig['post-types'][0] = combinedPostTypes;
    }

    return combinedConfig;
  } catch (error) {
    console.error(error);
  }
};
