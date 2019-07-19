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
module.exports = async location => {
  const recordData = record.read(location);

  if (recordData) {
    try {
      const storePath = recordData.path.post;
      const response = await store.github.deleteFile(storePath, {
        message: `:x: Deleted post\nwith ${config.name}`
      });
      if (response) {
        return utils.success('delete', location);
      }
    } catch (error) {
      return utils.error('server_error', `Unable to delete ${location}. ${error.message}`);
    }
  }

  return utils.error('not_found');
};
