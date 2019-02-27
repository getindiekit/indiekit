const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');
const history = require(process.env.PWD + '/app/lib/history');
const response = require(process.env.PWD + '/app/lib/micropub/response');

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
        message: `:x: Post deleted\nwith ${config.name}`
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
