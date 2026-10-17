/**
 * Service documentation
 * @type {ErrorRequestHandler}
 */
export const documentationController = (error, request, response, next) => {
  if (request.accepts("html")) {
    response.render("auth", {
      title: response.locals.__("auth.guidance.title"),
      ...(error.message && { error }),
    });
  } else if (request.accepts("json")) {
    return next(error);
  }
};

/**
 * @import { ErrorRequestHandler } from "express"
 */
