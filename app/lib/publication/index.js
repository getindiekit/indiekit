const path = require('path');

const appConfig = require(__basedir + '/config');
const cache = require(__basedir + '/lib/cache');
/**
 * Gets a publication’s configuration file and combines its values with defaults
 * set by the application.
 *
 * @module publication
 * @returns {Promise} Configuration object
 */
module.exports = async () => {
  try {
    // Fetch and cache remote configuration
    let remoteConfig = await cache.read(appConfig.config.path, appConfig.config.file);
    if (remoteConfig) {
      console.info('Remote has configuration');
      remoteConfig = JSON.parse(remoteConfig);
    }

    // Merge remote configuration with application defaults
    const combinedConfig = {...remoteConfig, ...appConfig.defaults};

    // Fetch and cache remote template files
    let combinedPostTypes;
    const defaultPostTypes = appConfig.defaults['post-types'][0];
    const remotePostTypes = remoteConfig['post-types'][0];

    if (remotePostTypes) {
      console.info('Remote has configured post types');
      // @todo Make asynchronous
      for (const key in remotePostTypes) {
        if (Object.prototype.hasOwnProperty.call(remotePostTypes, key)) {
          const postType = remotePostTypes[key];
          const remoteTemplate = postType.template;
          const cacheTemplate = path.join('templates', `${key}.njk`);
          const cacheTemplatePath = path.join(appConfig.cache.dir, cacheTemplate);
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
