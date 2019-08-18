const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');
const derivePostType = require('post-type-discovery');

const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/lib/github');
const microformats = require(process.env.PWD + '/lib/microformats');
const publication = require(process.env.PWD + '/lib/publication');
const store = require(process.env.PWD + '/lib/store');
const render = require(process.env.PWD + '/lib/render');

/**
 * Creates a post file.
 *
 * @exports create
 * @param {Object} pub Publication configuration
 * @param {Object} mf2 Microformats2 object
 * @returns {String} Location of created file
 */
module.exports = async (pub, mf2) => {
  // Derive type
  const type = derivePostType(mf2);

  // Get type config
  const typeConfig = pub['post-types'][type];

  // Derive properties
  const {properties} = mf2;
  properties.content = microformats.deriveContent(mf2);
  properties.photo = await microformats.derivePhoto(mf2);
  properties.published = microformats.derivePuplished(mf2);
  properties.slug = microformats.deriveSlug(mf2, pub['slug-separator']);

  // Get template
  const template = await publication.getPostTypeTemplate(typeConfig).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  // Render publish path and public url
  const path = render(typeConfig.post.path, properties);
  let url = render(typeConfig.post.url, properties);
  url = new URL(url, config.pub.url);
  url = url.href;

  // Render content
  const content = render(template, camelcaseKeys(properties));

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

  // Upload post file to GitHub
  const response = await github.createFile(path, content, {
    message: `${typeConfig.icon} Created ${_.toLower(typeConfig.name)} post`
  }).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  if (response) {
    store.set(url, postData);
    return postData;
  }
};
