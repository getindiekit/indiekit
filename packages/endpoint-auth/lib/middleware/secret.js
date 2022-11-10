import process from "node:process";
import { IndiekitError } from "@indiekit/error";

/**
 * Check that server secret has been set
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const hasSecret = (request, response, next) => {
  if (!process.env.SECRET) {
    const error = IndiekitError.notImplemented(
      response.__("NotImplementedError.secret")
    );

    next(error);
  }

  next();
};
