import process from "node:process";
import { fetch } from "undici";
import HttpError from "http-errors";
import jwt from "jsonwebtoken";
import { getCanonicalUrl } from "../utils.js";

export const tokenController = {
  /**
   * Verify access token
   *
   * @param {object} request HTTP request
   * @param {Promise|object} response HTTP response
   * @param {Function} next Callback
   * @returns {object} HTTP response
   */
  get(request, response, next) {
    if (request.headers.authorization) {
      try {
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
            new HttpError(
              403,
              "Publication URL does not match that provided by access token"
            )
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
        next(new HttpError(401, `JSON Web Token error: ${error.message}`));
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
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {Promise|object} HTTP response
   */
  async post(request, response, next) {
    const { publication } = request.app.locals;
    const { client_id, code, redirect_uri } = request.query;

    try {
      if (!client_id) {
        throw new Error("Missing client ID");
      }

      if (!code) {
        throw new Error("Missing code");
      }

      if (!redirect_uri) {
        throw new Error("Missing redirect URI");
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

      const body = await endpointResponse.json();

      if (!endpointResponse.ok) {
        return next(
          new HttpError(
            endpointResponse.status,
            body.error_description || endpointResponse.statusText
          )
        );
      }

      // Canonicalise publication and token URLs before comparing
      const accessTokenMe = getCanonicalUrl(body.me);
      const publicationMe = getCanonicalUrl(publication.me);
      const isAuthenticated = accessTokenMe === publicationMe;

      if (!isAuthenticated) {
        return next(
          new HttpError(
            403,
            "Publication URL does not match that provided by access token"
          )
        );
      }

      const tokenData = {
        client_id: getCanonicalUrl(client_id),
        date_issued: new Date(),
        me: accessTokenMe,
        scope: body.scope,
      };

      const authResponse = {
        access_token: jwt.sign(tokenData, process.env.TOKEN_SECRET, {
          expiresIn: 60 * 60 * 24 * 365,
        }),
        me: accessTokenMe,
        scope: body.scope,
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
      return next(new HttpError(400, error.message));
    }
  },
};
