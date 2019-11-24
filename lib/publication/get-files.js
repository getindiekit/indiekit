const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const cache = require(process.env.PWD + '/lib/cache');
const github = require(process.env.PWD + '/lib/github');
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
  let value;

  // Fetch from cache
  value = cache.get(key);

  if (value === undefined) {
    const contents = await github.getContents(path).catch(() => {
      throw new IndieKitError({
        error: 'Not found',
        error_description: `${key} could not be found in the cache or at the specified remote location`
      });
    });

    // Fetch from GitHub
    value = contents.data.content;
    cache.set(key, value);
  }

  return value;
};
