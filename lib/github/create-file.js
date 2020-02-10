const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/lib/utils');

const {Octokit} = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

/**
 * Creates a new file in a GitHub repository.
 *
 * @exports createFile
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, content, options) => {
  path = utils.normalizePath(path);
  content = Buffer.from(content).toString('base64');

  const createdFile = await octokit.repos.createOrUpdateFile({
    owner: config.github.user,
    repo: config.github.repo,
    branch: config.github.branch,
    message: options.message,
    path,
    content
  }).catch(error => {
    throw new IndieKitError({
      error: 'Octokit error',
      error_description: error.message
    });
  });

  return createdFile;
};
