const fs = require('fs');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const cache = require(process.env.PWD + '/lib/cache');

/**
 * Gets a post type’s configured template from cache (configured)
 * or file system (default).
 *
 * @exports getPostTypeTemplate
 * @param {Object} postTypeConfig Post type configuration
 * @returns {String} Nunjucks template
 */
module.exports = async postTypeConfig => {
  let template;

  if (postTypeConfig.template.cacheKey) {
    // Get publisher configured template from cache
    template = cache.get(postTypeConfig.template.cacheKey);
    if (template === undefined) {
      throw new IndieKitError({
        error: 'Not found',
        error_description: `Key \`${postTypeConfig.template.cacheKey}\` not found`
      });
    }
  } else {
    // Read default template from file system
    template = fs.readFileSync(postTypeConfig.template);
    template = Buffer.from(template).toString('utf-8');
  }

  return template;
};
