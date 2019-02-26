const path = require('path');
const fs = require('fs-extra');

const appConfig = require(__basedir + '/config.js');
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
    const type = microformats.deriveType(postData);
    const typeConfig = pubConfig['post-types'][0][type];

    // Render publish and destination paths
    const postPath = render(typeConfig.post, context);
    const urlPath = render(typeConfig.url, context);

    // Render template
    const templatePath = typeConfig.template;
    const templateData = fs.readFileSync(templatePath);
    const template = Buffer.from(templateData).toString('utf-8');
    console.log('template', template);
    const content = render(template, context);

    // Create post on GitHub
    const githubResponse = await github.createFile(postPath, content, {
      message: `:robot: New ${type} created\nwith ${appConfig.name}`
    });

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

  return response.error('server_error');
};
