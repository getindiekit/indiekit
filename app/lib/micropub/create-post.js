const fs = require('fs-extra');
const _ = require('lodash');
const getType = require('post-type-discovery');

const config = require(process.env.PWD + '/app/config');
const memos = require(process.env.PWD + '/app/lib/memos');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const render = require(process.env.PWD + '/app/lib/render');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Creates a new post
 *
 * @memberof micropub
 * @module createPost
 * @param {Object} pub Publication configuration
 * @param {String} body Body content (contains microformats2 object)
 * @param {String} files File attachments
 * @returns {String} Location of created post
 */
module.exports = async (pub, body, files) => {
  // Determine post type
  let type;
  if (files) {
    // Infer media type from first file attachment
    type = utils.deriveMediaType(files[0].mimetype);
  } else {
    // Create the `items` array getType() expects
    const mf2 = {items: [body]};
    type = getType(mf2);
  }

  const typeConfig = _.find(pub['post-types'], {type});
  const slugSeparator = pub['slug-separator'];

  // Update properties
  const {properties} = body;
  properties.published = microformats.derivePuplished(body);
  properties.content = microformats.deriveContent(body);
  properties.slug = microformats.deriveSlug(body, slugSeparator);
  properties.photo = await microformats.derivePhoto(body, files, typeConfig);

  // Render template
  const templatePath = typeConfig.path.template;
  const templateData = fs.readFileSync(templatePath);
  const template = Buffer.from(templateData).toString('utf-8');
  const content = render(template, properties);

  // Render publish and destination paths
  const postPath = render(typeConfig.path.post, properties);
  const urlPath = render(typeConfig.path.url, properties);

  // Prepare location and new memo
  const location = config.url + urlPath;
  const memo = {post: postPath, url: location};

  // Create post on GitHub
  try {
    const response = await store.github.createFile(postPath, content, {
      message: `:robot: New ${type} created\nwith ${config.name}`
    });

    if (response) {
      memos.update('create', memo);
      return micropub.response('create_pending', location);
    }
  } catch (error) {
    return micropub.error('server_error', error);
  }
};
