const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const cache = require(process.env.PWD + '/lib/cache');
const github = require(process.env.PWD + '/lib/github');
const logger = require(process.env.PWD + '/lib/logger');
const utils = require(process.env.PWD + '/lib/utils');

/**
 * Gets publication’s configuration files from remote and adds them to cache.
 *
 * @exports getFiles
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

  logger.debug(`publication.getFiles, ${key}`, {value});

  return value;
};
