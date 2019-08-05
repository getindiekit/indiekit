const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');

const Octokit = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

const getContents = require('./get-contents');

/**
 * Deletes a file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#delete-a-file GitHub REST API v3: Delete a file}
 *
 * @memberof github
 * @exports deleteFile
 * @param {String} path Path to file
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, options) => {
  try {
    const getResponse = await getContents(path);
    if (getResponse.data.sha !== undefined) {
      const deleteResponse = await octokit.repos.deleteFile({
        owner: config.github.user,
        repo: config.github.repo,
        branch: config.github.branch,
        path,
        message: `${options.message}\nwith ${config.name}`,
        sha: getResponse.data.sha
      });
      return deleteResponse;
    }

    throw new Error(`No SHA found for ${path}`);
  } catch (error) {
    logger.error('github.deleteFile', {error});
    throw new Error(error.message);
  }
};
