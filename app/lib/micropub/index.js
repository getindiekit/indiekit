/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 *
 * @module micropub
 */
module.exports = {
  action: require(process.env.PWD + '/app/lib/micropub/action'),
  createMedia: require(process.env.PWD + '/app/lib/micropub/create-media'),
  createPost: require(process.env.PWD + '/app/lib/micropub/create-post'),
  query: require(process.env.PWD + '/app/lib/micropub/query')
};
