import process from "node:process";

import { IndiekitError } from "@indiekit/error";

/**
 * Check that server secret has been set
 * @type {import("express").RequestHandler}
 */
export const hasSecret = (request, response, next) => {
  if (!process.env.SECRET) {
    const error = IndiekitError.notImplemented(
      response.locals.__("NotImplementedError.secret"),
    );

    next(error);
  }

  next();
};
