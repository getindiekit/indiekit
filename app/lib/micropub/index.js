/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 *
 * @module micropub
 */
module.exports = {
  create: require(__basedir + '/lib/micropub/create'),
  delete: require(__basedir + '/lib/micropub/delete'),
  query: require(__basedir + '/lib/micropub/query'),
  response: require(__basedir + '/lib/micropub/response'),
  update: require(__basedir + '/lib/micropub/update')
};
