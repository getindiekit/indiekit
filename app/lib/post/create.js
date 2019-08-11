const fs = require('fs-extra');
const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');

const {IndieKitError} = require(process.env.PWD + '/app/errors');
const cache = require(process.env.PWD + '/app/cache');
const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const record = require(process.env.PWD + '/app/lib/record');
const render = require(process.env.PWD + '/app/lib/render');

/**
 * Creates a post file
 *
 * @memberof post
 * @module create
 * @param {Object} pub Publication configuration
 * @param {Object} mf2 Microformats2 object
 * @returns {String} Location of created file
 */
module.exports = async (pub, mf2) => {
  // Determine post type
  const type = microformats.derivePostType(mf2);
  const typeConfig = pub['post-types'][type];

  // Update properties
  const {properties} = mf2;
  properties.content = microformats.deriveContent(mf2);
  properties.photo = await microformats.derivePhoto(mf2);
  properties.published = microformats.derivePuplished(mf2);
  properties.slug = microformats.deriveSlug(mf2, pub['slug-separator']);

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

  // Render publish and destination paths
  const postPath = render(typeConfig.post.path, properties);
  const postUrl = render(typeConfig.post.url, properties);

  // Prepare location and activity record
  const url = new URL(postUrl, config.pub.url);
  const location = url.href;
  const recordData = {
    location,
    post: {
      path: postPath,
      url: postUrl
    },
    mf2: {
      type: ['h-entry'],
      properties,
      'mp-slug': properties.slug
    }
  };

  // Upload post to GitHub
  const response = await github.createFile(postPath, content, {
    message: `${typeConfig.icon} Created ${_.toLower(typeConfig.name)} post`
  }).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  if (response) {
    record.set(location, recordData);
    return location;
  }
};
