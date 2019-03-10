/**
 * Process and transform microformats in request so that it can be published to
 * a destination.
 *
 * @module memos
 */
module.exports = {
  create: require(process.env.PWD + '/app/lib/memos/create'),
  read: require(process.env.PWD + '/app/lib/memos/read')
};
