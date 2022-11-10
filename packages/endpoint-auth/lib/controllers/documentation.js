/**
 * Service documentation
 *
 * @param {object} error - Error
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const documentationController = (error, request, response, next) => {
  if (request.accepts("html")) {
    response.render("auth", {
      title: response.__("auth.guidance.title"),
      error: error.message,
    });
  } else if (request.accepts("json")) {
    return next(error);
  }
};
