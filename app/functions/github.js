/**
 * Get, create and delete data at a specified path at configured GitHub repo.
 *
 * @module functions/github
 */

const fetch = require('node-fetch');

const appConfig = require(__basedir + '/app/config.js');
const utils = require(__basedir + '/app/functions/utils.js');

/**
 * Makes GitHub request with amended options
 *
 * @private
 * @param {Object} args Arguments to amened
 * @return {Promise} Fetch request to GitHub API
 */
const requestWithOptions = async args => {
  const url = `https://api.github.com/repos/${appConfig.github.user}/${appConfig.github.repo}/contents/${args.path}`;
  const method = args.method || 'get';
  const options = {
    method,
    headers: {
      'content-type': 'application/vnd.github.v3+json; charset=UTF-8',
      authorization: `token ${appConfig.github.token}`,
      'User-Agent': `${appConfig.name}`
    }
  };

  if (method !== 'get') {
    const body = {
      message: null,
      content: null,
      branch: appConfig.github.branch,
      path: null
    };

    if (args.message) {
      body.message = args.message;
    }

    if (args.content) {
      body.content = args.content;
    }

    if (args.path) {
      body.path = args.path;
    }

    if (args.sha) {
      body.sha = args.sha;
    }

    options.body = JSON.stringify(body);
  }

  try {
    const request = await fetch(url, options);
    return await request.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Gets the contents of a file or directory in a repository
 *
 * @see {@link https://developer.github.com/v3/repos/contents/#get-contents GitHub REST API v3: Get Contents}
 * @param {String} path Path to file
 * @return {String} GitHub HTTP response
 */
const getContents = async path => {
  path = utils.normalizePath(path);

  try {
    const request = await requestWithOptions({
      method: 'get',
      path
    });
    let {content} = request;
    if (content) {
      content = Buffer.from(content, 'base64').toString('utf8');

      return {
        content,
        sha: request.sha
      };
    }

    throw new Error('No content provided in request');
  } catch (error) {
    console.error(error);
  }
};

/**
 * Creates a new file in a GitHub repository
 *
 * @see {@link https://developer.github.com/v3/repos/contents/#create-a-file GitHub REST API v3: Create a file}
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {String} GitHub HTTP response
 */
const createFile = async (path, content, options) => {
  path = utils.normalizePath(path);

  try {
    return await requestWithOptions({
      method: 'put',
      message: options.message,
      content: Buffer.from(content).toString('base64'),
      path
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Deletes a new file in a GitHub repository
 *
 * @see {@link https://developer.github.com/v3/repos/contents/#delete-a-file GitHub REST API v3: Delete a file}
 * @param {String} path Path to file
 * @param {String} options Options
 * @return {String} GitHub HTTP response
 */
const deleteFile = async (path, options) => {
  try {
    const reponse = await getContents(path);
    if (reponse) {
      return await requestWithOptions({
        method: 'delete',
        message: options.message,
        sha: reponse.sha,
        path
      });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getContents,
  createFile,
  deleteFile
};
