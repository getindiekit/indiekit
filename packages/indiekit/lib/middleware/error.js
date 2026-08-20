import { IndiekitError } from "@indiekit/error";
import cleanStack from "clean-stack";
import makeDebug from "debug";

const debug = makeDebug("indiekit:error");

/**
 * Return not found error
 * @type {import("express").RequestHandler}
 */
export const notFound = (request, response, next) => {
  const error = IndiekitError.notFound(
    response.locals.__("NotFoundError.page"),
  );

  next(error);
};

/**
 * Return error
 * @type {import("express").ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
export const internalServer = (error, request, response, next) => {
  const status = error.status || 500;
  response.status(status);

  // A stack trace describes the server: absolute paths, dependency versions and
  // the shape of its internals. `cause` can carry more still, since it holds
  // whatever a wrapped error was given. Neither helps whoever made the request,
  // so send them only in development, matching how `devMode` is derived in
  // lib/routes.js.
  const isDevelopment = process.env.NODE_ENV === "development";

  // Send debug logging output to console.error
  debug.log = console.error.bind(console);
  debug("Error", error);

  if (request.accepts("html")) {
    response.render("error", {
      title: response.locals.__(`${error.name}.title:${error.name}`),
      content: error.message,
      name: error.name,
      ...(isDevelopment && { stack: error.stack }),
      status,
      uri: error.uri,
    });
  } else if (request.accepts("json")) {
    response.json({
      error: error.code || error.name,
      error_description: error.message || error.cause?.message,
      ...(error.uri && { error_uri: error.uri }),
      ...(error.scope && { scope: error.scope }),
      ...(isDevelopment && { stack: cleanStack(error.stack) }),
      ...(isDevelopment && error.cause && { cause: error.cause }),
    });
  } else {
    response.send(error.toString());
  }
};
