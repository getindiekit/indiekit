/**
 * Record of an action and associated changes, stored for later retrieval,
 * i.e. for updating or undelete a post.
 *
 * @module record
 */
module.exports = {
  create: require(process.env.PWD + '/app/lib/record/create'),
  read: require(process.env.PWD + '/app/lib/record/read')
};
