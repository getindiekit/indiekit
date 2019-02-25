/**
 * Caches files to prevent application from making excessive requests to APIs
 *
 * @module cache
 */
module.exports = {
  delete: require(__basedir + '/lib/cache/delete'),
  read: require(__basedir + '/lib/cache/read'),
  update: require(__basedir + '/lib/cache/update')
};
