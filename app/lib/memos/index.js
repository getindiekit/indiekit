/**
 * Records of actions and resulting changes, stored for later retrevial.
 * (i.e. for update and undelete actions).
 *
 * @module memos
 */
module.exports = {
  create: require(process.env.PWD + '/app/lib/memos/create'),
  read: require(process.env.PWD + '/app/lib/memos/read'),
  update: require(process.env.PWD + '/app/lib/memos/update')
};
