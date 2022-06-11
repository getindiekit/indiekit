import crypto from "node:crypto";
import process from "node:process";
import httpError from "http-errors";
import { fetch } from "undici";
import {
  findBearerToken,
  requestAccessToken,
  verifyAccessToken,
} from "./tokens.js";
import { generateState, validateState } from "./state.js";
import { getCanonicalUrl, randomString } from "./utils.js";

export const IndieAuth = class {
  constructor(options = {}) {
    this.codeVerifier = randomString(100);
    this.devMode = options.devMode;
    this.iv = crypto.randomBytes(16);
    this.me = getCanonicalUrl(options.me);
  }

  /**
   * Get authentication URL
   *
   * @param {string} authorizationEndpoint Authorization endpoint
   * @param {string} scope Authorisation scope
   * @param {string} state State
   * @returns {Promise|string} Authentication URL
   */
  async getAuthUrl(authorizationEndpoint, scope, state) {
    if (!scope) {
      throw new httpError.BadRequest("You need to provide some scopes");
    }

    // PKCE code challenge
    const base64Digest = crypto
      .createHash("sha256")
      .update(this.codeVerifier)
      .digest("base64");
    const codeChallenge = base64Digest.toString("base64url");

    const authUrl = new URL(authorizationEndpoint);
    authUrl.searchParams.append("client_id", this.clientId);
    authUrl.searchParams.append("code_challenge_method", "S256");
    authUrl.searchParams.append("code_challenge", codeChallenge);
    authUrl.searchParams.append("me", this.me);
    authUrl.searchParams.append("redirect_uri", this.redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", scope);
    authUrl.searchParams.append("state", state);

    return authUrl.href;
  }

  /**
   * Exchange authorization code for access token
   *
   * @param {string} tokenEndpoint Token endpoint
   * @param {string} code Code received from authentication endpoint
   * @returns {Promise|object} Access token
   */
  async authorizationCodeGrant(tokenEndpoint, code) {
    try {
      const tokenUrl = new URL(tokenEndpoint);
      const endpointResponse = await fetch(tokenUrl.href, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.clientId,
          code,
          code_verifier: this.codeVerifier,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
        }),
      });

      const body = await endpointResponse.json();

      if (!endpointResponse.ok) {
        throw httpError(
          endpointResponse.status,
          body.error_description || endpointResponse.statusText
        );
      }

      if (!body.scope || !body.access_token) {
        throw new httpError.BadRequest(
          "The token endpoint did not return the expected parameters"
        );
      }

      return body.access_token;
    } catch (error) {
      throw httpError(error);
    }
  }

  /**
   * Redirect user to IndieAuth login
   *
   * @returns {object} HTTP response
   */
  login() {
    return async (request, response) => {
      try {
        const { application, publication } = request.app.locals;
        this.clientId = getCanonicalUrl(application.url);

        const callbackUrl = `${application.url}/session/auth`;
        const { redirect } = request.query;
        this.redirectUri = redirect
          ? `${callbackUrl}?redirect=${redirect}`
          : `${callbackUrl}`;

        const scope = "create update delete media";
        const state = generateState(this.clientId, this.iv);
        const authUrl = await this.getAuthUrl(
          publication.authorizationEndpoint,
          scope,
          state
        );

        return response.redirect(authUrl);
      } catch (error) {
        return response.status(401).render("session/login", {
          title: response.__("session.login.title"),
          error: error.message,
        });
      }
    };
  }

  /**
   * Check credentials match those returned by IndieAuth
   *
   * @returns {object} HTTP response
   */
  authenticate() {
    return async (request, response, next) => {
      const { publication } = request.app.locals;
      const { code, redirect, state } = request.query;

      // Check redirect is to a local path
      if (redirect) {
        const validRedirect = redirect.match(/^\/[\w\d/?=&]*$/);

        if (!validRedirect) {
          return response.status(403).render("session/login", {
            title: response.__("session.login.title"),
            error: response.__("session.login.error.validateRedirect"),
          });
        }
      }

      try {
        // Check for state mismatch
        if (!code || !state || !validateState(state, this.clientId, this.iv)) {
          return response.status(403).render("session/login", {
            title: response.__("session.login.title"),
            error: response.__("session.login.error.validateState"),
          });
        }

        // Request access token
        const authorizedToken = await this.authorizationCodeGrant(
          publication.tokenEndpoint,
          code
        );

        // Set session token and redirect to requested resource
        request.session.token = authorizedToken;

        return response.redirect(redirect || "/");
      } catch (error) {
        return next(httpError(error));
      }
    };
  }

  /**
   * Check if user is authorized
   *
   * @returns {Function} Next middleware
   */
  authorise() {
    const { devMode, me } = this;

    return async function (request, response, next) {
      const { tokenEndpoint } = request.app.locals.publication;

      if (devMode) {
        request.session.token = process.env.NODE_ENV;
        request.session.scope = "create update delete media";
      }

      // If have session scope and token, go to next middleware
      const { scope, token } = request.session;
      if (scope && token) {
        return next();
      }

      // Validate bearer token sent in request
      try {
        const bearerToken = findBearerToken(request);
        request.session.token = bearerToken;

        const accessToken = await requestAccessToken(
          tokenEndpoint,
          bearerToken
        );
        const { scope } = verifyAccessToken(me, accessToken);
        request.session.scope = scope;

        next();
      } catch (error) {
        if (request.method === "GET") {
          return response.redirect(
            `/session/login?redirect=${request.originalUrl}`
          );
        }

        next(error);
      }
    };
  }
};
