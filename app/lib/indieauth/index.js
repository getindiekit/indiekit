/**
 * Use {@link https://www.w3.org/TR/indieauth/ IndieAuth} to ensure only
 * authenticated users can use endpoint for posting to configured destination.
 *
 * @module indieauth
 */
module.exports = {
  request: require(__basedir + '/lib/indieauth/request'),
  verifyToken: require(__basedir + '/lib/indieauth/verify-token')
};
