/**
 * Get, create, update and delete data at a specified path at configured GitHub
 * repo.
 *
 * @module functions/github
 */

const fetch = require('node-fetch');

const appConfig = require(__basedir + '/app/config.js');
const utils = require(__basedir + '/app/functions/utils.js');

const repoContentUrl = `https://api.github.com/repos/${appConfig.github.user}/${appConfig.github.repo}/contents/`;

/**
 * Returns path to repo object from full URL
 *
 * @todo Change this function so that it uses config options to translate
 * destination URL back to repo path.
 * @private
 * @example githubFilePathFromUrl('https://github.com/<username>/<repo>/blob/<branch>/foobar.txt') => 'foobar.txt'
 * @param {String} url GitHub URL
 * @return {String} Normalized object
 */
const githubFilePathFromUrl = url => {
  const regex = /https:\/\/github\.com\/(?<username>[\w-]+)\/(?<repo>[\w-]+)\/blob\/(?<branch>[\w-]+)\//;
  return url.replace(regex, '');
};

/**
 * Makes GitHub request with amended options
 *
 * @private
 * @param {Object} args Arguments to amened
 * @return {Promise} Fetch request to GitHub API
 */
const requestWithOptions = async args => {
  const url = repoContentUrl + args.path;
  console.log('url', url);
  const method = args.method || 'get';
  const options = {
    method,
    headers: {
      'content-type': 'application/json',
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

const getFile = async path => {
  path = githubFilePathFromUrl(path);
  const result = await getContents(path);

  if (result.error) {
    console.error(result.error);
  } else {
    return result;
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
 * @param {String} postType Microformats post type
 * @return {String} GitHub HTTP response
 */
const createFile = async (path, content, postType) => {
  path = utils.normalizePath(path);

  try {
    return await requestWithOptions({
      method: 'put',
      message: `:robot: ${postType} created with ${appConfig.name}`,
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
 * @param {String} content File content
 * @param {String} postType Microformats post type
 * @return {String} GitHub HTTP response
 */
const deleteFile = async path => {
  path = githubFilePathFromUrl(path);

  try {
    const reponse = await getContents(path);
    if (reponse) {
      return await requestWithOptions({
        method: 'delete',
        message: `:robot: Post deleted with ${appConfig.name}`,
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
  getFile,
  createFile,
  deleteFile
};
