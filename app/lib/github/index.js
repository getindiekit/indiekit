/**
 * Get, create and delete data at a specified path at configured GitHub repo.
 *
 * @module github
 */
const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/app/lib/utils');

const Octokit = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`,
  log: require('console-log-level')({level: 'info'})
});

/**
 * Reads content of a file or directory in a repository
 * @see {@link https://developer.github.com/v3/repos/contents/#get-contents GitHub REST API v3: Get Contents}
 *
 * @param {String} path Path to file
 * @return {Promise} GitHub HTTP response
 */
const getContents = async path => {
  path = utils.normalizePath(path);

  try {
    const response = await octokit.repos.getContents({
      owner: config.github.user,
      repo: config.github.repo,
      ref: config.github.branch,
      path
    });
    response.data.content = Buffer.from(response.data.content, 'base64').toString('utf8');
    return response;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Creates a new file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#create-a-file GitHub REST API v3: Create a file}
 *
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
const createFile = async (path, content, options) => {
  path = utils.normalizePath(path);

  try {
    return await octokit.repos.createFile({
      owner: config.github.user,
      repo: config.github.repo,
      branch: config.github.branch,
      path,
      content: Buffer.from(content).toString('base64'),
      message: options.message
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates a file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#update-a-file GitHub REST API v3: Update a file}
 *
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
const updateFile = async (path, content, options) => {
  path = utils.normalizePath(path);

  try {
    const response = await getContents(path);
    if (response) {
      return await octokit.repos.updateFile({
        owner: config.github.user,
        repo: config.github.repo,
        branch: config.github.branch,
        path,
        message: options.message,
        content: Buffer.from(content).toString('base64'),
        sha: response.data.sha
      });
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Deletes a file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#delete-a-file GitHub REST API v3: Delete a file}
 *
 * @param {String} path Path to file
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
const deleteFile = async (path, options) => {
  try {
    const response = await getContents(path);
    if (response) {
      return await octokit.repos.deleteFile({
        owner: config.github.user,
        repo: config.github.repo,
        branch: config.github.branch,
        path,
        message: options.message,
        sha: response.data.sha
      });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createFile,
  deleteFile,
  getContents,
  updateFile
};
