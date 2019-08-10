const {IndieKitError} = require(process.env.PWD + '/app/errors');
const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/app/lib/utils');

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
  path = utils.normalizePath(path);

  const contents = await getContents(path);

  const deletedFile = await octokit.repos.deleteFile({
    owner: config.github.user,
    repo: config.github.repo,
    branch: config.github.branch,
    message: `${options.message}\nwith ${config.name}`,
    sha: contents.data.sha,
    path
  }).catch(error => {
    throw new IndieKitError({
      status: error.status,
      error: error.name,
      error_description: error.message
    });
  });

  return deletedFile;
};
