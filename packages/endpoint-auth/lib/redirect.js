/**
 * Validate `redirect_uri`
 * @param {string} redirectUri - Redirect URL
 * @param {string} clientId - URL of client
 * @returns {boolean} Valid redirect
 * @see {@link https://indieauth.spec.indieweb.org/#redirect-url}
 * @todo If redirect URIs doesn’t share same host as `client_id`, validate
 * against list of redirect URIs fetched from `<link>` tags or `Link` HTTP
 * headers with a `rel` attribute of `redirect_uri` at the `client_id` URL.
 */
export const validateRedirect = (redirectUri, clientId) => {
  const redirectHost = new URL(redirectUri).host;
  const clientHost = new URL(clientId).host;

  return redirectHost === clientHost;
};
