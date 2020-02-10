const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/lib/utils');

const {Octokit} = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

/**
 * Deletes a file in a GitHub repository.
 *
 * @exports deleteFile
 * @param {String} path Path to file
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, options) => {
  path = utils.normalizePath(path);

  const contents = await octokit.repos.getContents({
    owner: config.github.user,
    repo: config.github.repo,
    ref: config.github.branch,
    path
  }).catch(error => {
    throw new IndieKitError({
      error: 'Octokit error',
      error_description: error.message
    });
  });

  const deletedFile = await octokit.repos.deleteFile({
    owner: config.github.user,
    repo: config.github.repo,
    branch: config.github.branch,
    message: options.message,
    sha: contents.data.sha,
    path
  }).catch(error => {
    throw new IndieKitError({
      error: 'Octokit error',
      error_description: error.message
    });
  });

  return deletedFile;
};
