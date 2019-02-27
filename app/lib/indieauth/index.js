/**
 * Use {@link https://www.w3.org/TR/indieauth/ IndieAuth} to ensure only
 * authenticated users can use endpoint for posting to configured destination.
 *
 * @module indieauth
 */
module.exports = {
  request: require(process.env.PWD + '/app/lib/indieauth/request'),
  verifyToken: require(process.env.PWD + '/app/lib/indieauth/verify-token')
};
