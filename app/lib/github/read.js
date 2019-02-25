const request = require(__basedir + '/lib/github/request');
const utils = require(__basedir + '/lib/utils');

/**
 * Reads content of a file or directory in a repository
 * @see {@link https://developer.github.com/v3/repos/contents/#get-contents GitHub REST API v3: Get Contents}
 *
 * @memberof github
 * @module read
 * @param {String} path Path to file
 * @return {Promise} GitHub HTTP response
 */
module.exports = async path => {
  path = utils.normalizePath(path);

  try {
    const response = await request({
      method: 'get',
      path
    });
    let {content} = response;
    if (content) {
      content = Buffer.from(content, 'base64').toString('utf8');

      return {
        content,
        sha: request.sha
      };
    }
  } catch (error) {
    console.error(error);
  }
};
