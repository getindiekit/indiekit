/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 *
 * @module micropub
 */
module.exports = {
  createMedia: require(process.env.PWD + '/app/lib/micropub/create-media'),
  createPost: require(process.env.PWD + '/app/lib/micropub/create-post'),
  deletePost: require(process.env.PWD + '/app/lib/micropub/delete-post'),
  undeletePost: require(process.env.PWD + '/app/lib/micropub/undelete-post'),
  updatePost: require(process.env.PWD + '/app/lib/micropub/update-post'),
  query: require(process.env.PWD + '/app/lib/micropub/query')
};
