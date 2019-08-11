const config = require(process.env.PWD + '/app/config');
const NodeCache = require('node-cache');

module.exports = new NodeCache({
  stdTTL: config.cache.ttl
});
