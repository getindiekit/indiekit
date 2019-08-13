const fs = require('fs-extra');
const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const cache = require(process.env.PWD + '/lib/cache');
const github = require(process.env.PWD + '/lib/github');
const render = require(process.env.PWD + '/lib/render');

/**
 * Undeletes a post
 *
 * @memberof post
 * @module undelete
 * @param {Object} pub Publication configuration
 * @param {Object} postData Stored post data object
 * @returns {String} Location of undeleted post
*/

module.exports = async (pub, postData) => {
  // Determine post type
  const typeConfig = pub['post-types'][postData.post.type];

  // Update properties
  const {properties} = postData.mf2;

  // Get template
  let template;
  if (typeConfig.template.cacheKey) {
    // Get publisher configured template from cache
    template = await cache.get(typeConfig.template.cacheKey);
  } else {
    // Read default template from file system
    template = fs.readFileSync(typeConfig.template);
    template = Buffer.from(template).toString('utf-8');
  }

  // Render template with context
  const context = camelcaseKeys(properties);
  const content = render(template, context);

  const postPath = postData.post.path;
  const {location} = postData;

  // Upload post to GitHub
  const response = await github.createFile(postPath, content, {
    message: `${typeConfig.icon} Undeleted ${_.toLower(typeConfig.name)} post`
  }).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  if (response) {
    return location;
  }
};
