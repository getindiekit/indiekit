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
 * Makes GitHub request with amended options
 *
 * @private
 * @param {Object} args Arguments to amened
 * @return {Promise} Fetch request to GitHub API
 */
const requestWithOptions = async function (args) {
  const url = repoContentUrl + args.path;
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

  return fetch(url, options);
};

/**
 * Gets the contents of a file or directory in a repository
 *
 * @see {@link https://developer.github.com/v3/repos/contents/#get-contents GitHub REST API v3: Get Contents}
 * @param {String} path Path to file
 * @return {String} GitHub HTTP response
 */
exports.getContents = async function (path) {
  path = utils.normalizePath(path);

  return requestWithOptions({
    method: 'get',
    path
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
  }).then(body => {
    let content;
    if (body.content) {
      content = Buffer.from(body.content, 'base64').toString('utf8');
    }

    return {
      content,
      sha: body.sha
    };
  }).catch(error => {
    console.error('github.getContents', error);
  });
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
exports.createFile = async function (path, content, postType) {
  path = utils.normalizePath(path);

  return requestWithOptions({
    method: 'put',
    message: `:robot: ${postType} created with ${appConfig.name}`,
    content: Buffer.from(content).toString('base64'),
    path
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
  }).then(json => {
    return json;
  }).catch(error => {
    console.error('github.createFile', error);
  });
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
exports.deleteFile = async function (path) {
  path = utils.githubFilePathFromUrl(path);
  const result = await module.exports.getContents(path);

  if (result.error) {
    console.error(result.error);
  } else {
    return requestWithOptions({
      method: 'delete',
      message: `:robot: Post deleted with ${appConfig.name}`,
      sha: result.sha,
      path
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(json => {
      return json;
    }).catch(error => {
      console.error('github.createFile', error);
    });
  }
};

exports.getFile = async function (path) {
  path = utils.githubFilePathFromUrl(path);
  const result = await module.exports.getContents(path);

  if (result.error) {
    console.error(result.error);
  } else {
    return result;
  }
};
