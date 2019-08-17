const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');

const github = require(process.env.PWD + '/lib/github');
const publication = require(process.env.PWD + '/lib/publication');
const render = require(process.env.PWD + '/lib/render');

/**
 * Undeletes a post.
 *
 * @exports undelete
 * @param {Object} pub Publication configuration
 * @param {Object} postData Stored post data object
 * @returns {String} Location of undeleted post
*/

module.exports = async (pub, postData) => {
  // Get type
  const {type} = postData.post;

  // Get properties
  const {properties} = postData.mf2;

  // Get type config
  const typeConfig = pub['post-types'][type];

  // Get template
  const template = await publication.getPostTypeTemplate(typeConfig);

  // Get publish path
  const {path} = postData.post;

  // Render content
  const content = render(template, camelcaseKeys(properties));

  // Upload post to GitHub
  const response = await github.createFile(path, content, {
    message: `${typeConfig.icon} Undeleted ${_.toLower(typeConfig.name)} post`
  });

  if (response) {
    return postData;
  }
};
