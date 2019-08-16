/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 */
module.exports = {
  action: require(process.env.PWD + '/app/middleware/micropub/action'),
  createMedia: require(process.env.PWD + '/app/middleware/micropub/create-media'),
  createPost: require(process.env.PWD + '/app/middleware/micropub/create-post'),
  query: require(process.env.PWD + '/app/middleware/micropub/query')
};
