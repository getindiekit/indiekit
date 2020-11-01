import createError from 'http-errors';

export const notFound = (request, response, next) => {
  const httpError = createError.NotFound('Resource not found'); // eslint-disable-line new-cap
  response.status(httpError.statusCode);

  if (request.accepts('html')) {
    response.render('document', {
      title: 'Page not found',
      content: 'If you entered a web address please check it was correct.'
    });
  } else {
    next(httpError);
  }
};

export const internalServer = (error, request, response, next) => { // eslint-disable-line no-unused-vars
  const httpError = createError(error.statusCode || 500);
  response.status(httpError.statusCode);

  if (request.accepts('json')) {
    response.json({
      error: error.error || httpError.message,
      error_description: error.message,
      scope: error.scope
    });
  } else {
    response.send(error.message);
  }
};
