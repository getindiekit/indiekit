const config = require(process.env.PWD + '/app/config');
const logger = require(process.env.PWD + '/app/logger');
const utils = require(process.env.PWD + '/app/lib/utils');

const Octokit = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

const getContents = require('./get-contents');

/**
 * Updates a file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#update-a-file GitHub REST API v3: Update a file}
 *
 * @memberof store/github
 * @exports updateFile
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, content, options) => {
  path = utils.normalizePath(path);

  const contents = await getContents(path).catch(error => {
    logger.error('github.updateFile, getContents', {error});
    throw new Error(error.message);
  });

  const updatedFile = await octokit.repos.createOrUpdateFile({
    owner: config.github.user,
    repo: config.github.repo,
    branch: config.github.branch,
    path,
    message: `${options.message}\nwith ${config.name}`,
    content: Buffer.from(content).toString('base64'),
    sha: contents.data.sha
  }).catch(error => {
    logger.error('github.updateFile, createOrUpdateFile', {error});
    throw new Error(error.message);
  });

  return updatedFile;
};
