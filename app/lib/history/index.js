/**
 * Creates log of Micropub actions taken
 *
 * @module history
 */
module.exports = {
  create: require(__basedir + '/lib/history/create'),
  read: require(__basedir + '/lib/history/read'),
  update: require(__basedir + '/lib/history/update')
};
