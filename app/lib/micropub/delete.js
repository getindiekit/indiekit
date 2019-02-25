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
  let historyEntry;

  try {
    const getHistory = await history.read();
    const {entries} = getHistory;
    historyEntry = entries.filter(entry => entry.create.url === url);
  } catch (error) {
    console.error(error);
  }

  if (historyEntry) {
    try {
      const repoPath = historyEntry[0].create.post;
      const githubResponse = await github.deleteFile(repoPath, {
        message: `:x: Post deleted with ${appConfig.name}`
      });
      if (githubResponse) {
        // @todo Save properties to history to enable undelete action
        return response.success('delete', url);
      }
    } catch (error) {
      throw new Error(`Unable to delete ${url}. ${error.message}`);
    }
  }

  return response.error('not_found');
};
