/**
 * Creates log of Micropub actions taken
 *
 * @module history
 */
module.exports = {
  create: require(process.env.PWD + '/app/lib/history/create'),
  read: require(process.env.PWD + '/app/lib/history/read'),
  update: require(process.env.PWD + '/app/lib/history/update')
};
