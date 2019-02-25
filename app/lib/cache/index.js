/**
 * Caches files to prevent application from making excessive requests to APIs
 *
 * @module cache
 */
module.exports = {
  create: require(__basedir + '/lib/cache/create'),
  delete: require(__basedir + '/lib/cache/delete'),
  read: require(__basedir + '/lib/cache/read')
};
