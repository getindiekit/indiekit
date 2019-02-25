const read = require(__basedir + '/lib/github/read');
const request = require(__basedir + '/lib/github/request');

/**
 * Deletes a file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#delete-a-file GitHub REST API v3: Delete a file}
 *
 * @memberof github
 * @module delete
 * @param {String} path Path to file
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, options) => {
  try {
    const reponse = await read(path);
    if (reponse) {
      return await request({
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
