/**
 * Verify access tokens and determine scope.
 *
 * @module auth
 */
module.exports = {
  indieauth: require(process.env.PWD + '/app/lib/auth/indieauth'),
  scope: require(process.env.PWD + '/app/lib/auth/scope')
};
