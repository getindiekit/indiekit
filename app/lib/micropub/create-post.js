const fs = require('fs-extra');
const getType = require('post-type-discovery');

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');
const history = require(process.env.PWD + '/app/lib/history');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const render = require(process.env.PWD + '/app/lib/render');
const response = require(process.env.PWD + '/app/lib/micropub/response');

/**
 * Creates a new post
 *
 * @memberof micropub
 * @module update
 * @param {Object} publication Publication configuration
 * @param {String} body Body content (contains microformats2 object)
 * @param {String} files File attachments
 * @returns {String} Location of created post
 */
module.exports = async (publication, body, files) => {
  const {properties} = body;

  // Determine post type
  // @todo Infer type by `type` using multer field object
  let type;
  if (files) {
    type = 'photo';
  } else {
    // Create the `items` array getType() expects
    const mf2 = {items: new Array(body)};
    type = getType(mf2);
  }

  const typeConfig = publication['post-types'][0][type];

  // Date
  properties.published = microformats.derivePuplished(body);

  // Content
  properties.content = microformats.deriveContent(body);

  // Slug
  const slugSeparator = publication['slug-separator'];
  const slug = microformats.deriveSlug(body, slugSeparator);
  properties.slug = slug;

  // Photos
  try {
    properties.photo = await microformats.derivePhoto(body, files, typeConfig);
  } catch (error) {
    console.error(error);
  }

  // Render publish and destination paths
  const postPath = render(typeConfig.post, properties);
  const urlPath = render(typeConfig.url, properties);

  // Render template
  const templatePath = typeConfig.template;
  const templateData = fs.readFileSync(templatePath);
  const template = Buffer.from(templateData).toString('utf-8');
  const content = render(template, properties);

  // Create post on GitHub
  try {
    const githubResponse = await github.createFile(postPath, content, {
      message: `:robot: New ${type} created\nwith ${config.name}`
    });

    // Update history and send success reponse
    const location = config.url + urlPath;
    const historyEntry = {
      post: postPath,
      url: location
    };

    if (githubResponse) {
      history.update('create', historyEntry);
      return response.success('create_pending', location);
    }
  } catch (error) {
    return response.error('server_error', error);
  }
};
