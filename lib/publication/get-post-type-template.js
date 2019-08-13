const fs = require('fs-extra');

const cache = require(process.env.PWD + '/lib/cache');

/**
 * Gets a post types configured template from cache (configured)
 * or file system (default).
 *
 * @memberof publication
 * @module getPostTypeTemplate
 * @param {Object} postTypeConfig Post type configuration
 * @returns {String} Nunjucks template
 */
module.exports = async postTypeConfig => {
  let template;

  if (postTypeConfig.template.cacheKey) {
    // Get publisher configured template from cache
    template = await cache.get(postTypeConfig.template.cacheKey);
  } else {
    // Read default template from file system
    template = fs.readFileSync(postTypeConfig.template);
    template = Buffer.from(template).toString('utf-8');
  }

  return template;
};
