const path = require('path');

const config = require(process.env.PWD + '/app/config');

/**
 * Returns previously published posts.
 *
 * @exports getPosts
 * @returns {Array} Array of posts
 */
module.exports = () => {
  const storePath = path.join(config.data.dir, 'store.json');
  const postStore = require(storePath);

  const posts = [];

  for (const key in postStore) {
    if (Object.prototype.hasOwnProperty.call(postStore, key)) {
      const postRecord = postStore[key];
      posts.push(postRecord.mf2);
    }
  }

  return {
    items: posts
  };
};
