const {IndieKitError} = require(process.env.PWD + '/app/errors');
const cache = require(process.env.PWD + '/app/cache');
const github = require(process.env.PWD + '/app/lib/github');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Gets publication’s configuration files from remote and adds them
 * to cache.
 *
 * @memberof publication
 * @module getFiles
 * @param {String} path Remote file path
 * @returns {String|Object} Cache value
 */
module.exports = async path => {
  const key = utils.normalizePath(path);
  const contents = await github.getContents(path).catch(error => {
    throw new IndieKitError({
      error: error.name,
      error_description: error.message
    });
  });

  let value;
  try {
    value = cache.get(key, true);
  } catch (error) {
    value = contents.data.content;
    cache.set(key, value);
  }

  return value;
};
