const config = require(__basedir + '/config');
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
  const type = null; // @todo Determine post type
  const githubResponse = github.updateFile(repoPath, content, {
    message: `:robot: ${type} updated\nwith ${config.name}`
  });
  if (githubResponse) {
    /* @todo If path has changed, return 'update_created' */
    return response.success('update', url);
  }

  return response.error('not_found');
};
