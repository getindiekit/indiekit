const config = require(process.env.PWD + '/app/config');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Updates a post
 *
 * @memberof micropub
 * @module updatePost
 * @param {String} url URL path to post
 * @param {String} content Content to update
 * @returns {Object} Response
 */
module.exports = async (url, content) => {
  const storePath = utils.filePathFromUrl(url);
  const type = null; // @todo Determine post type
  const response = store.github.updateFile(storePath, content, {
    message: `:robot: ${type} updated\nwith ${config.name}`
  });
  if (response) {
    /* TODO: If path has changed, return 'update_created' */
    return utils.success('update', url);
  }

  return utils.error('not_found');
};
