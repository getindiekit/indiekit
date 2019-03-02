/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 *
 * @module micropub
 */
module.exports = {
  createMedia: require(process.env.PWD + '/app/lib/micropub/create-media'),
  createPost: require(process.env.PWD + '/app/lib/micropub/create-post'),
  error: require(process.env.PWD + '/app/lib/micropub/error'),
  deletePost: require(process.env.PWD + '/app/lib/micropub/delete-post'),
  query: require(process.env.PWD + '/app/lib/micropub/query'),
  response: require(process.env.PWD + '/app/lib/micropub/response'),
  update: require(process.env.PWD + '/app/lib/micropub/update-post')
};
