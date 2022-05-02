import crypto from "node:crypto";
import process from "node:process";
import got from "got";
import HttpError from "http-errors";
import {
  findBearerToken,
  requestAccessToken,
  verifyAccessToken,
} from "./tokens.js";
import { decrypt, encrypt, getCanonicalUrl, randomString } from "./utils.js";

export const IndieAuth = class {
  constructor(options = {}) {
    this.codeVerifier = randomString(100);
    this.iv = crypto.randomBytes(16);
    this.options = options;
    this.me = getCanonicalUrl(this.options.me);
  }

  /**
   * Generate unique encrypted state value
   *
   * @returns {string} State
   */
  generateState() {
    const state = encrypt(
      JSON.stringify({
        clientId: this.clientId,
        date: Date.now(),
      }),
      this.iv
    );

    return state;
  }

  /**
   * Validate state generated using `generateState` method
   *
   * @param {string} state State
   * @returns {object|boolean} Validated state object, returns false on failure
   */
  validateState(state) {
    try {
      state = JSON.parse(decrypt(state, this.iv));
      const validClient = state.clientId === this.clientId;
      const validDate = state.date > Date.now() - 1000 * 60 * 10;

      if (validClient && validDate) {
        return state;
      }
    } catch {
      return false;
    }
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
      throw new Error("You need to provide some scopes");
    }

    try {
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

      return authUrl.toString();
    } catch (error) {
      throw new Error(error.message);
    }
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
      const parameters = {
        client_id: this.clientId,
        code,
        code_verifier: this.codeVerifier,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      };

      const { body } = await got.post(tokenEndpoint, {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          accept: "application/json, application/x-www-form-urlencoded",
        },
        responseType: "json",
        searchParams: parameters,
      });

      if (!body.scope || !body.access_token) {
        throw new Error(
          "The token endpoint did not return the expected parameters"
        );
      }

      return body.access_token;
    } catch (error) {
      const statusCode = error.response?.statusCode || 500;
      const message = error.response?.body?.error_description || error.message;
      throw new HttpError(statusCode, message);
    }
  }

  /**
   * Check if user is authorized
   *
   * @returns {Function} Next middleware
   */
  authorise() {
    const { me } = this;

    return async function (request, response, next) {
      const { tokenEndpoint } = request.app.locals.publication;

      // Use placeholder session data if using development environment
      if (process.env.NODE_ENV === "development") {
        request.session = {
          token: "development",
          scope: "create update delete media",
        };
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

        next(new HttpError(400, error));
      }
    };
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
        const state = this.generateState();
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
        if (!code || !state || !this.validateState(state)) {
          return response.status(403).render("session/login", {
            title: response.__("session.login.title"),
            error: response.__("session.login.error.validateState"),
          });
        }

        // Request access token
        const token = await this.authorizationCodeGrant(
          publication.tokenEndpoint,
          code
        );

        // Set session token and redirect to requested resource
        request.session.token = token;
        return response.redirect(redirect || "/");
      } catch (error) {
        return next(new HttpError(400, error));
      }
    };
  }
};
