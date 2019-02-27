const fs = require('fs-extra');

const config = require(__basedir + '/config');
const github = require(__basedir + '/lib/github');
const history = require(__basedir + '/lib/history');
const microformats = require(__basedir + '/lib/microformats');
const render = require(__basedir + '/lib/render');
const response = require(__basedir + '/lib/micropub/response');

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
  try {
    const {properties} = body;

    // Determine post type
    // @todo Infer type by `type` using multer field object
    let type;
    if (files) {
      type = 'photo';
    } else {
      type = microformats.deriveType(body);
    }

    const typeConfig = publication['post-types'][0][type];

    // Date
    properties.published = microformats.derivePuplishedProperty(body);

    // Content
    properties.content = microformats.deriveContentProperty(body);

    // Slug
    const slugSeparator = publication['slug-separator'];
    const slug = microformats.deriveSlug(body, slugSeparator);
    properties.slug = slug;

    // Photos
    properties.photo = await microformats.derivePhotoProperty(body, files, typeConfig);

    // Render publish and destination paths
    const postPath = render(typeConfig.post, properties);
    const urlPath = render(typeConfig.url, properties);

    // Render template
    const templatePath = typeConfig.template;
    const templateData = fs.readFileSync(templatePath);
    const template = Buffer.from(templateData).toString('utf-8');
    console.log('template', template);
    const content = render(template, properties);

    // Create post on GitHub
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

    throw new Error(`Unable to create ${location}`);
  } catch (error) {
    console.error(error);
  }

  return response.error('server_error');
};
