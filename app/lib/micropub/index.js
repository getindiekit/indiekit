/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 *
 * @module micropub
 */
module.exports = {
  create: require(process.env.PWD + '/app/lib/micropub/create'),
  delete: require(process.env.PWD + '/app/lib/micropub/delete'),
  query: require(process.env.PWD + '/app/lib/micropub/query'),
  response: require(process.env.PWD + '/app/lib/micropub/response'),
  update: require(process.env.PWD + '/app/lib/micropub/update')
};
