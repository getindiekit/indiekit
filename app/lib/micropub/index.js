/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 *
 * @module micropub
 */
module.exports = {
  createPost: require(process.env.PWD + '/app/lib/micropub/create-post'),
  deletePost: require(process.env.PWD + '/app/lib/micropub/delete-post'),
  query: require(process.env.PWD + '/app/lib/micropub/query'),
  response: require(process.env.PWD + '/app/lib/micropub/response'),
  update: require(process.env.PWD + '/app/lib/micropub/update-post')
};
