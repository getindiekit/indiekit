const request = require(__basedir + '/lib/github/request');
const utils = require(__basedir + '/lib/utils');

/**
 * Creates a new file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#create-a-file GitHub REST API v3: Create a file}
 *
 * @memberof github
 * @module create
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, content, options) => {
  path = utils.normalizePath(path);

  try {
    return await request({
      method: 'put',
      message: options.message,
      content: Buffer.from(content).toString('base64'),
      path
    });
  } catch (error) {
    console.error(error);
  }
};
