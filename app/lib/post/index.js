/**
 * Creates, updates and deletes posts.
 *
 * @module post
 */
module.exports = {
  create: require(process.env.PWD + '/app/lib/post/create'),
  delete: require(process.env.PWD + '/app/lib/post/delete'),
  undelete: require(process.env.PWD + '/app/lib/post/undelete'),
  update: require(process.env.PWD + '/app/lib/post/update')
};
