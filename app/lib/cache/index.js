/**
 * Caches files to prevent application from making excessive requests to APIs
 *
 * @module cache
 */

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');
const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: config.cache['max-age']
});

// Read
const read = async repoPath => {
  const value = cache.get(repoPath);
  if (value === undefined) {
    const repoData = await github.getContents(repoPath).catch(error => {
      throw new Error(error.message);
    });

    const freshData = repoData.data.content;
    cache.set(repoPath, freshData);
    return freshData;
  }
};

module.exports = {
  cache,
  read
};
