/**
 * IndieAuth authorization request
 *
 * The specification also requires `code_challenge` and
 * `code_challenge_method`, but authorization endpoints may accept requests
 * without them for backwards compatibility with older clients.
 * @see {@link https://indieauth.spec.indieweb.org/#authorization-request}
 */
interface IndieAuthAuthorizationRequest {
  /** Response type, i.e. `code` */
  response_type: string;
  /** Client URL */
  client_id: string;
  /** URL to redirect the user to after approving the request */
  redirect_uri: string;
  /** Value returned unmodified to the client, to prevent CSRF attacks */
  state: string;
  /** PKCE code challenge */
  code_challenge?: string;
  /** Hashing method used to calculate the code challenge, i.e. `S256` */
  code_challenge_method?: string;
  /** Requested scopes, space separated */
  scope?: string;
  /** URL the user entered */
  me?: string;
}

/**
 * IndieAuth request to redeem an authorization code
 *
 * Parameters are optional as received. The specification requires all of them
 * except `code_verifier`, which may be omitted for backwards compatibility.
 * @see {@link https://indieauth.spec.indieweb.org/#request}
 */
interface IndieAuthCodeRedemptionRequest {
  /** Grant type, i.e. `authorization_code` */
  grant_type?: string;
  /** Authorization code received from the authorization endpoint */
  code?: string;
  /** Client URL, which must match that in the authorization request */
  client_id?: string;
  /** Redirect URL, which must match that in the authorization request */
  redirect_uri?: string;
  /** Plaintext random string the code challenge was derived from */
  code_verifier?: string;
}

/**
 * IndieAuth client metadata
 * @see {@link https://indieauth.spec.indieweb.org/#client-metadata}
 */
interface IndieAuthClientMetadata {
  /** Client identifier, which must match the URL of this document */
  client_id: string;
  /** Name of the client, to present on the consent screen */
  client_name?: string;
  /** URL of a page with information about the client */
  client_uri?: string;
  /** URL of a logo or icon for the client */
  logo_uri?: string;
  /** Redirect URIs the client may use */
  redirect_uris?: string[];
}

/**
 * IndieAuth profile information
 * @see {@link https://indieauth.spec.indieweb.org/#profile-information}
 */
interface IndieAuthProfile {
  /** Name the user wishes to provide to the client */
  name?: string;
  /** URL of the user’s website */
  url?: string;
  /** Photo the user wishes clients to use as a profile image */
  photo?: string;
  /** Email address, if the `email` scope was requested */
  email?: string;
}

/**
 * IndieAuth access token response
 * @see {@link https://indieauth.spec.indieweb.org/#access-token-response}
 */
interface IndieAuthAccessTokenResponse {
  /** OAuth 2.0 Bearer Token */
  access_token: string;
  /** Canonical profile URL of the user the token corresponds to */
  me: string;
  /** Token type, i.e. `Bearer` */
  token_type?: string;
  /** Granted scopes, space separated */
  scope?: string;
  /** Profile information, if requested and granted */
  profile?: IndieAuthProfile;
  /** Lifetime of the access token, in seconds */
  expires_in?: number;
  /** Refresh token, to obtain new access tokens */
  refresh_token?: string;
}

/**
 * IndieAuth access token verification response
 *
 * An inactive token returns only `active`, set to `false`.
 * @see {@link https://indieauth.spec.indieweb.org/#access-token-verification-response}
 */
interface IndieAuthTokenVerificationResponse {
  /** Whether the token is currently active */
  active: boolean;
  /** Profile URL of the user the token corresponds to */
  me?: string;
  /** Client ID the token was issued to */
  client_id?: string;
  /** Scopes associated with the token, space separated */
  scope?: string;
  /** When the token expires, in seconds since the Unix epoch */
  exp?: number;
  /** When the token was issued, in seconds since the Unix epoch */
  iat?: number;
}
