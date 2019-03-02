const config = require(process.env.PWD + '/app/config');
const micropub = require(process.env.PWD + '/app/lib/micropub');
const store = require(process.env.PWD + '/app/lib/store');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Updates a post
 *
 * @memberof micropub
 * @module update
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
    /* @todo If path has changed, return 'update_created' */
    return micropub.response('update', url);
  }

  return micropub.error('not_found');
};
