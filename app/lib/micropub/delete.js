const appConfig = require(__basedir + '/config.js');
const github = require(__basedir + '/lib/github');
const history = require(__basedir + '/lib/history');
const response = require(__basedir + '/lib/micropub/response');

/**
 * Deletes a post
 *
 * @memberof micropub
 * @module delete
 * @param {String} url URL of published post
 * @returns {Promise} Response object
 */
module.exports = async url => {
  let repoPath;
  let entries;

  try {
    const getHistory = await history.read();
    entries = getHistory.entries;
  } catch (error) {
    console.error(error);
  }

  if (entries) {
    entries.forEach(entry => {
      if (entry.create.url === url) {
        repoPath = entry.create.post;
      }
    });
  }

  try {
    const githubResponse = await github.delete(repoPath, {
      message: `:robot: Post deleted with ${appConfig.name}`
    });
    if (githubResponse) {
      return response.success('delete', url);
    }
  } catch (error) {
    throw new Error(`Unable to delete ${url}`);
  }
};
