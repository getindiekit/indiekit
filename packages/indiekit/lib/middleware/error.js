import httpError from "http-errors";

export const notFound = (request, response, next) => {
  const notFoundError = new httpError.NotFound("Resource not found");
  response.status(notFoundError.status);

  if (request.accepts("html")) {
    response.render("document", {
      title: response.__("errors.notFound.title"),
      content: response.__("errors.notFound.content"),
    });
  } else {
    next(notFoundError);
  }
};

// eslint-disable-next-line no-unused-vars
export const internalServer = (error, request, response, next) => {
  const applicationError = httpError(error.status || 500);
  response.status(applicationError.status);

  if (request.accepts("html")) {
    response.render("document", {
      title: applicationError.message || error.name,
      content: error.message,
    });
  } else if (request.accepts("json")) {
    response.json({
      error: applicationError.message || error.name,
      error_description: error.message,
    });
  } else {
    response.send(error.message);
  }
};
