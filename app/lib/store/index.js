/**
 * Interfaces to remote locations where files and configuration are stored.
 *
 * @module store
 */
module.exports = {
  github: require(process.env.PWD + '/app/lib/store/github')
};
