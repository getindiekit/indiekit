const path = require('path');
const _ = require('lodash');

const config = require(process.env.PWD + '/app/config');

/**
 * Reads a memo
 *
 * @memberof memos
 * @module create
 * @param {Object} url URL of post
 * @return {Object} Memo
 */
module.exports = url => {
  const memosFile = path.join(config.cache.dir, 'memos.json');
  const memos = require(memosFile) || {};
  const memo = _.find(memos, {url});

  return memo;
};
