const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/lib/github');
const microformats = require(process.env.PWD + '/lib/microformats');
const publication = require(process.env.PWD + '/lib/publication');
const store = require(process.env.PWD + '/lib/store');
const render = require(process.env.PWD + '/lib/render');

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
  // Derive post type
  const type = microformats.derivePostType(mf2);

  // Derive properties
  const {properties} = mf2;
  properties.content = microformats.deriveContent(mf2);
  properties.photo = await microformats.derivePhoto(mf2);
  properties.published = microformats.derivePuplished(mf2);
  properties.slug = microformats.deriveSlug(mf2, pub['slug-separator']);

  // Get type config
  const typeConfig = pub['post-types'][type];

  // Get template
  const template = await publication.getPostTypeTemplate(typeConfig).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  // Render publish path and url
  const path = render(typeConfig.post.path, properties);
  const url = render(typeConfig.post.url, properties);

  // Render content
  const content = render(template, camelcaseKeys(properties));

  // Prepare location and activity record
  const location = new URL(url, config.pub.url);

  // Create record
  const postData = {
    post: {
      type,
      path,
      url
    },
    mf2: {
      type: ['h-entry'],
      properties,
      'mp-slug': properties.slug
    }
  };

  // Upload post to GitHub
  const response = await github.createFile(path, content, {
    message: `${typeConfig.icon} Created ${_.toLower(typeConfig.name)} post`
  }).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  if (response) {
    store.set(location.href, postData);
    return location.href;
  }
};
