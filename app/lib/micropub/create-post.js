const fs = require('fs-extra');
const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');
const getType = require('post-type-discovery');

const config = require(process.env.PWD + '/app/config');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const record = require(process.env.PWD + '/app/lib/record');
const render = require(process.env.PWD + '/app/lib/render');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Creates a new post
 *
 * @memberof micropub
 * @module createPost
 * @param {Object} pub Publication configuration
 * @param {String} mf2 Microformats2 object
 * @param {String} files File attachments
 * @returns {String} Location of created post
 */
module.exports = async (pub, mf2, files) => {
  // Determine post type
  // TODO: Consolidate into separate module
  let type;
  if (files && files.length > 0) {
    // Infer media type from first file attachment
    type = utils.deriveMediaType(files[0].mimetype);
  } else {
    // Create the `items` array getType() expects
    const items = {items: [mf2]};
    type = getType(items);
  }

  // Override post type to support experimental types
  // @see: https://indieweb.org/posts
  if (mf2.properties['bookmark-of']) {
    type = 'bookmark';
  }

  if (mf2.properties.checkin) {
    type = 'checkin';
  }

  if (mf2.properties.start) {
    type = 'event';
  }

  const typeConfig = pub['post-types'][type];
  const slugSeparator = pub['slug-separator'];

  // Update properties
  const {properties} = mf2;
  properties.published = microformats.derivePuplished(mf2);
  properties.content = microformats.deriveContent(mf2);
  properties.slug = microformats.deriveSlug(mf2, slugSeparator);
  properties.photo = await microformats.derivePhoto(mf2, files, typeConfig);

  // Render template
  const templatePath = typeConfig.path.template;
  const templateData = fs.readFileSync(templatePath);
  const template = Buffer.from(templateData).toString('utf-8');
  const context = camelcaseKeys(properties);
  const content = render(template, context);

  // Render publish and destination paths
  const postPath = render(typeConfig.path.post, properties);
  const urlPath = render(typeConfig.path.url, properties);

  // Prepare location and activity record
  const url = new URL(urlPath, config.url);
  const location = url.href;
  const recordData = {
    path: {
      post: postPath
    },
    mf2: {
      type: ['h-entry'],
      properties,
      'mp-slug': properties.slug
    }
  };

  // TODO: Upload media?
  // If files in Micropub request, and they’ve not been added via the
  // media endpoint (how to know?), should they be uploaded here?

  // Create post on GitHub
  try {
    const response = await store.github.createFile(postPath, content, {
      message: `${typeConfig.icon} Created ${_.toLower(typeConfig.name)} post\nwith ${config.name}`
    });

    if (response) {
      record.create(location, recordData);
      return utils.success('create_pending', location);
    }
  } catch (error) {
    return utils.error('server_error', `Unable to create ${location}. ${error.message}`);
  }
};
