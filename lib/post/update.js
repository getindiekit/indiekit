const camelcaseKeys = require('camelcase-keys');

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/lib/github');
const publication = require(process.env.PWD + '/lib/publication');
const render = require(process.env.PWD + '/lib/render');
const store = require(process.env.PWD + '/lib/store');
const utils = require(process.env.PWD + '/lib/utils');

/**
 * Updates a post.
 *
 * @exports update
 * @param {Object} req Request
 * @param {Object} postData Stored post data object
 * @returns {String} Location of undeleted post
*/
module.exports = async (req, postData) => {
  const {body} = req;
  const {pub} = req.app.locals;

  // Get type
  const {type} = postData.post;

  // Get properties
  let {properties} = postData.mf2;

  // Replace property entries
  if (Object.prototype.hasOwnProperty.call(body, 'replace')) {
    properties = utils.replaceEntries(properties, body.replace);
  }

  // Add properties
  if (Object.prototype.hasOwnProperty.call(body, 'add')) {
    properties = utils.addProperties(properties, body.add);
  }

  // Remove properties and/or property entries
  if (Object.prototype.hasOwnProperty.call(body, 'delete')) {
    if (Array.isArray(body.delete)) {
      properties = utils.deleteProperties(properties, body.delete);
    } else {
      properties = utils.deleteEntries(properties, body.delete);
    }
  }

  // Get type config
  const typeConfig = pub['post-types'][type];

  // Get template
  const template = await publication.getPostTypeTemplate(typeConfig);

  // Update publish path and public url
  const path = render(typeConfig.post.path, properties);
  let url = render(typeConfig.post.url, properties);
  url = utils.derivePermalink(config.pub.url, url);

  // Update content
  const content = render(template, camelcaseKeys(properties));

  // Update record
  postData = {
    post: {
      type,
      path,
      url
    },
    mf2: {
      type: ['h-entry'],
      properties
    }
  };

  // Update (or create new) post file on GitHub
  const response = await github.updateFile(path, content, {
    message: req.__mf('{icon} %s updated\nwith {app}', req.__(`post.${type}`), {
      app: config.name,
      icon: typeConfig.icon
    })
  });

  if (response) {
    store.set(url, postData);
    return postData;
  }
};
