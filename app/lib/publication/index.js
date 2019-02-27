const path = require('path');

const config = require(__basedir + '/config');
const defaults = require('./defaults');

const cache = require(__basedir + '/lib/cache');
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
    let remoteConfig = await cache.read(config.config.path, config.config.file);
    if (remoteConfig) {
      console.info('Remote has configuration');
      remoteConfig = JSON.parse(remoteConfig);
    }

    console.log('remoteConfig', remoteConfig);
    console.log('defaults', defaults);

    // Merge remote configuration with application defaults
    const combinedConfig = {...defaults, ...remoteConfig};

    // Fetch and cache remote template files
    let combinedPostTypes;
    const defaultPostTypes = defaults['post-types'][0];
    const remotePostTypes = remoteConfig['post-types'][0];

    if (remotePostTypes) {
      console.info('Remote has configured post types');
      // @todo Make asynchronous
      for (const key in remotePostTypes) {
        if (Object.prototype.hasOwnProperty.call(remotePostTypes, key)) {
          const postType = remotePostTypes[key];
          const remoteTemplate = postType.template;
          const cacheTemplate = path.join('templates', `${key}.njk`);
          const cacheTemplatePath = path.join(config.cache.dir, cacheTemplate);
          await cache.read(remoteTemplate, cacheTemplate);

          // Update `template` value with location of cached template file
          postType.template = cacheTemplatePath;
        }
      }

      // Merge default post types with remote post types (with cached template paths)
      combinedPostTypes = {...defaultPostTypes, ...remotePostTypes};

      // Update combined configuration with new post type values
      combinedConfig['post-types'][0] = combinedPostTypes;
    }

    return combinedConfig;
  } catch (error) {
    console.error(error);
  }
};
