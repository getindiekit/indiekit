const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');
const response = require(process.env.PWD + '/app/lib/micropub/response');
const utils = require(process.env.PWD + '/app/lib/utils');

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
