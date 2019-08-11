/**
 * Verify access IndieAuth tokens and determine scope.
 *
 * @module indieauth
 */
module.exports = {
  checkScope: require(process.env.PWD + '/lib/indieauth/check-scope'),
  verifyToken: require(process.env.PWD + '/lib/indieauth/verify-token')
};
