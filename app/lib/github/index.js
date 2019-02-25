/**
 * Get, create and delete data at a specified path at configured GitHub repo.
 *
 * @module github
 */
module.exports = {
  create: require(__basedir + '/lib/github/create'),
  delete: require(__basedir + '/lib/github/delete'),
  read: require(__basedir + '/lib/github/read'),
  request: require(__basedir + '/lib/github/request'),
  update: require(__basedir + '/lib/github/update')
};
