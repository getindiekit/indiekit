const path = require('path');

const appConfig = require(__basedir + '/config.js');
const cache = require(__basedir + '/lib/cache');
const github = require(__basedir + '/lib/github');
const history = require(__basedir + '/lib/history');
const microformats = require(__basedir + '/lib/microformats');
const render = require(__basedir + '/lib/render');
const response = require(__basedir + '/lib/micropub/response');
const utils = require(__basedir + '/lib/utils');

const pubDefaults = appConfig.defaults;

/**
 * Creates a new post
 *
 * @memberof micropub
 * @module update
 * @param {Object} pubConfig Publication configuration
 * @param {String} body Body content (contains microformats2 object)
 * @param {String} files File attachments
 * @returns {String} Location of created post
 */
module.exports = async (pubConfig, body, files) => {
  try {
    // Get post data (original mf2 plus ammendments)
    const postData = await microformats.deriveData(pubConfig, body, files);
    const context = postData.properties;

    // Determine post type
    const type = microformats.postType(postData);
    const typeName = utils.capitalizeFirstLetter(type);
    const typeConfig = pubConfig['post-types'][0][type] || pubDefaults['post-types'][0][type];

    // Set publish and destination paths
    const postPath = render(typeConfig.post, context);
    const urlPath = render(typeConfig.url, context);

    // Render template (fetch configured from remote/cache, else use default)
    let template;
    const templatePathConfig = pubConfig['post-types'][0][type].template;
    const templatePathCached = path.join('templates', `${type}.njk`);
    const templatePathDefault = pubDefaults['post-types'][0][type].template;

    if (templatePathConfig) {
      template = await cache.read(templatePathConfig, templatePathCached);
    } else {
      template = templatePathDefault;
    }

    // Create post on GitHub
    const content = render(template, context);
    const githubResponse = await github.createFile(postPath, content, {
      message: `:robot: ${typeName} created with ${appConfig.name}`
    });
    console.log('githubResponse', githubResponse);

    // Update history and send success reponse
    const location = pubConfig.url + urlPath;
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
};
