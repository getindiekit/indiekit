/**
 * Caches files to prevent application from making excessive requests to APIs
 *
 * @module cache
 */
module.exports = {
  create: require(process.env.PWD + '/app/lib/cache/create'),
  delete: require(process.env.PWD + '/app/lib/cache/delete'),
  read: require(process.env.PWD + '/app/lib/cache/read')
};
