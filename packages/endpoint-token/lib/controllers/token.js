import process from "node:process";
import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
import jwt from "jsonwebtoken";
import { getCanonicalUrl } from "../utils.js";

export const tokenController = {
  /**
   * Verify access token
   *
   * @param {object} request - HTTP request
   * @param {Promise|object} response - HTTP response
   * @param {Function} next - Next middleware callback
   * @returns {object} HTTP response
   */
  get(request, response, next) {
    if (request.headers.authorization) {
      try {
        if (!process.env.TOKEN_SECRET) {
          return next(
            IndiekitError.notImplemented(
              response.__("NotImplementedError.tokenSecret")
            )
          );
        }

        const { publication } = request.app.locals;
        const bearerToken = request.headers.authorization
          .trim()
          .split(/\s+/)[1];
        const accessToken = jwt.verify(bearerToken, process.env.TOKEN_SECRET);

        // Normalize publication and token URLs before comparing
        const accessTokenMe = getCanonicalUrl(accessToken.me);
        const publicationMe = getCanonicalUrl(publication.me);
        const isAuthenticated = accessTokenMe === publicationMe;

        // Publication URL does not match that provided by access token
        if (!isAuthenticated) {
          return next(
            IndiekitError.forbidden(response.__("ForbiddenError.invalidMe"))
          );
        }

        if (
          request?.headers?.accept &&
          request.headers.accept.includes("application/json")
        ) {
          response.json(accessToken);
        } else {
          response.header("content-type", "application/x-www-form-urlencoded");
          response.send(new URLSearchParams(accessToken).toString());
        }
      } catch (error) {
        next(
          IndiekitError.unauthorized(
            response.__("UnauthorizedError.jwt", error.message)
          )
        );
      }
    } else {
      response.render("token", {
        title: response.__("token.title"),
      });
    }
  },

  /**
   * Grant access token
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @param {Function} next - Next middleware callback
   * @returns {Promise|object} HTTP response
   */
  async post(request, response, next) {
    const { application, publication } = request.app.locals;

    const client_id = request.body.client_id || request.query.client_id;
    const code = request.body.code || request.query.code;
    const redirect_uri =
      request.body.redirect_uri || request.query.redirect_uri;

    try {
      if (!process.env.TOKEN_SECRET) {
        return next(
          IndiekitError.notImplemented(
            response.__("NotImplementedError.tokenSecret")
          )
        );
      }

      if (!client_id) {
        throw IndiekitError.badRequest(
          response.__("BadRequestError.missingParameter", "client_id")
        );
      }

      if (!code) {
        throw IndiekitError.badRequest(
          response.__("BadRequestError.missingParameter", "code")
        );
      }

      if (!redirect_uri) {
        throw IndiekitError.badRequest(
          response.__("BadRequestError.missingParameter", "redirect_uri")
        );
      }

      const authUrl = new URL(publication.authorizationEndpoint);
      authUrl.searchParams.append("client_id", client_id);
      authUrl.searchParams.append("code", code);
      authUrl.searchParams.append("redirect_uri", redirect_uri);

      const endpointResponse = await fetch(authUrl.toString(), {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      });

      if (!endpointResponse.ok) {
        throw await IndiekitError.fromFetch(endpointResponse);
      }

      const body = await endpointResponse.json();

      // Canonicalise publication and token URLs before comparing
      const accessTokenMe = getCanonicalUrl(body.me);
      const publicationMe = getCanonicalUrl(publication.me);
      const isAuthenticated = accessTokenMe === publicationMe;

      if (!isAuthenticated) {
        return next(
          IndiekitError.forbidden(response.__("ForbiddenError.invalidMe"))
        );
      }

      const tokenData = {
        client_id: getCanonicalUrl(client_id),
        me: accessTokenMe,
        scope: body.scope,
      };

      const authResponse = {
        access_token: jwt.sign(tokenData, process.env.TOKEN_SECRET, {
          expiresIn: "90d",
          issuer: application.url + request.baseUrl,
        }),
        me: accessTokenMe,
        scope: body.scope,
        token_type: "Bearer",
      };

      if (
        request?.headers?.accept &&
        request.headers.accept.includes("application/json")
      ) {
        response.json(authResponse);
      } else {
        response.header("content-type", "application/x-www-form-urlencoded");
        response.send(new URLSearchParams(authResponse).toString());
      }
    } catch (error) {
      return next(error);
    }
  },
};
