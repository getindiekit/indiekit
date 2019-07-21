const fs = require('fs-extra');
const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');

const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');
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
  let type;
  if (files && files.length > 0) {
    type = utils.deriveMediaType(files[0]);
  } else {
    type = microformats.derivePostType(mf2);
  }

  const typeConfig = pub['post-types'][type];
  const slugSeparator = pub['slug-separator'];

  // Update properties
  const {properties} = mf2;
  properties.published = microformats.derivePuplished(mf2);
  properties.content = microformats.deriveContent(mf2);
  properties.slug = microformats.deriveSlug(mf2, slugSeparator);
  properties.photo = await microformats.derivePhoto(mf2, files, typeConfig);
  logger.info('Derived mf2 properties', {properties});

  // Render template
  const templatePath = typeConfig.template;
  const templateData = fs.readFileSync(templatePath);
  const template = Buffer.from(templateData).toString('utf-8');
  const context = camelcaseKeys(properties);
  const content = render(template, context);

  // Render publish and destination paths
  const postPath = render(typeConfig.post.path, properties);
  const postUrl = render(typeConfig.post.url, properties);

  // Prepare location and activity record
  const url = new URL(postUrl, config.url);
  const location = url.href;
  const recordData = {
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
      logger.info('micropub.createPost %s', location, {recordData});
      return utils.success('create_pending', location);
    }
  } catch (error) {
    logger.error('micropub.createPost', {error});
    return utils.error('server_error', `Unable to create ${location}. ${error.message}`);
  }
};
