const config = require(process.env.PWD + '/app/config');
const memos = require(process.env.PWD + '/app/lib/memos');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Deletes a post
 *
 * @memberof micropub
 * @module deletePost
 * @param {String} url URL of published post
 * @returns {Promise} Response object
 */
module.exports = async url => {
  const memo = memos.read(url);

  if (memo) {
    try {
      const storePath = memo.path.post;
      const response = await store.github.deleteFile(storePath, {
        message: `:x: Post deleted\nwith ${config.name}`
      });
      if (response) {
        return utils.success('delete', url);
      }
    } catch (error) {
      throw new Error(`Unable to delete ${url}. ${error.message}`);
    }
  }

  return utils.error('not_found');
};
