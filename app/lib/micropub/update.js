const appConfig = require(__basedir + '/config.js');
const github = require(__basedir + '/lib/github');
const response = require(__basedir + '/lib/micropub/response');
const utils = require(__basedir + '/lib/utils');

/**
 * Updates a post
 *
 * @memberof micropub
 * @module update
 * @param {String} url URL path to post
 * @param {String} content Content to update
 * @returns {Object} Response
 */
module.exports = async (url, content) => {
  const repoPath = utils.filePathFromUrl(url);
  const typeName = null; // @todo Determine post type
  const githubResponse = github.updateFile(repoPath, content, {
    message: `:robot: ${typeName} updated with ${appConfig.name}`
  });
  if (githubResponse) {
    /* @todo If path has changed, return 'update_created' */
    return response.success('update', url);
  }

  throw new Error(`Unable to update ${url}`);
};
