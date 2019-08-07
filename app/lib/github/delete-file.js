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
  const contents = await getContents(path).catch(error => {
    logger.error('github.deleteFile, getContents', {error});
    throw new Error(error.message);
  });

  const deletedFile = await octokit.repos.deleteFile({
    owner: config.github.user,
    repo: config.github.repo,
    branch: config.github.branch,
    path,
    message: `${options.message}\nwith ${config.name}`,
    sha: contents.data.sha
  }).catch(error => {
    logger.error('github.deleteFile, deleteFile', {error});
    throw new Error(error.message);
  });

  return deletedFile;
};
