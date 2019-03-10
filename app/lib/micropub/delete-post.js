const config = require(process.env.PWD + '/app/config');
const record = require(process.env.PWD + '/app/lib/record');
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
  const recordData = record.read(url);

  if (recordData) {
    try {
      const storePath = recordData.path.post;
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
