import { mf2 } from "microformats-parser";

const FETCH_TIMEOUT = 5000;

/**
 * Validate `redirect_uri`
 *
 * A redirect URI sharing the same host as `client_id` is always allowed. One
 * on a different host is only allowed if `client_id` declares it, via a
 * `<link rel="redirect_uri">` tag or a `Link` HTTP header. Anything that
 * prevents that check from succeeding (network error, non-2xx response,
 * unparseable markup) denies the redirect.
 * @param {string} redirectUri - Redirect URL
 * @param {string} clientId - URL of client
 * @returns {Promise<boolean>} Valid redirect
 * @see {@link https://indieauth.spec.indieweb.org/#redirect-url}
 */
export const validateRedirect = async (redirectUri, clientId) => {
  let redirectUrl;
  let clientUrl;

  try {
    redirectUrl = new URL(redirectUri);
    clientUrl = new URL(clientId);
  } catch {
    return false;
  }

  if (redirectUrl.host === clientUrl.host) {
    return true;
  }

  const declaredUris = await getDeclaredRedirectUris(clientId);

  return declaredUris.some((declaredUri) =>
    matchesDeclaredUri(redirectUrl, declaredUri),
  );
};

/**
 * Get redirect URIs declared at a `client_id` URL
 * @param {string} clientId - URL of client
 * @returns {Promise<string[]>} Declared redirect URIs
 */
const getDeclaredRedirectUris = async (clientId) => {
  try {
    const response = await fetch(clientId, {
      headers: { accept: "text/html" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      return [];
    }

    const fromHeader = parseLinkHeader(response.headers.get("link"));
    const body = await response.text();
    const { rels } = mf2(body, { baseUrl: clientId });

    return [...fromHeader, ...(rels.redirect_uri || [])];
  } catch {
    // Fail closed: an undiscoverable declaration is not a valid declaration
    return [];
  }
};

/**
 * Get URIs from a `Link` HTTP header with a `rel` of `redirect_uri`
 * @param {string|null} header - `Link` header value
 * @returns {string[]} Declared redirect URIs
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8288#section-3}
 */
const parseLinkHeader = (header) => {
  if (!header) {
    return [];
  }

  const uris = [];

  // Split on commas separating link values, not those within parameters
  for (const value of header.split(/,(?=\s*<)/)) {
    const [, uri, parameters] = value.match(/<([^>]*)>\s*;\s*(.*)/s) || [];

    if (uri) {
      const [, relationship] =
        parameters.match(/rel\s*=\s*"?([^";]+)"?/i) || [];

      if (relationship?.trim().split(/\s+/).includes("redirect_uri")) {
        uris.push(uri);
      }
    }
  }

  return uris;
};

/**
 * Check a redirect URL against a declared redirect URI
 *
 * Compared exactly, ignoring only a trailing slash on the path. Patterns are
 * deliberately not supported: the OAuth working group’s position is that
 * wildcards in redirect URLs open up attack vectors, and clients that appear
 * to need one generally do not. A browser extension’s redirect host is
 * derived from its extension ID, so it is fixed for a given extension and can
 * be declared literally.
 * @param {URL} redirectUrl - Redirect URL
 * @param {string} declaredUri - Declared redirect URI
 * @returns {boolean} Redirect URL matches declared URI
 * @see {@link https://github.com/indieweb/indieauth/issues/22#issuecomment-544204967}
 */
const matchesDeclaredUri = (redirectUrl, declaredUri) => {
  let declaredUrl;
  try {
    declaredUrl = new URL(declaredUri);
  } catch {
    return false;
  }

  // Ignore a trailing slash when comparing paths
  const redirectPath = redirectUrl.pathname.replace(/\/$/, "");
  const declaredPath = declaredUrl.pathname.replace(/\/$/, "");

  return (
    redirectUrl.protocol === declaredUrl.protocol &&
    redirectUrl.host === declaredUrl.host &&
    redirectPath === declaredPath
  );
};
