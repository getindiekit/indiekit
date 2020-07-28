import httpError from 'http-errors';

export const notFound = (request, response, next) => {
  const error = httpError.NotFound('Resource not found'); // eslint-disable-line new-cap
  response.status(error.status);

  if (request.accepts('html')) {
    response.render('document', {
      title: 'Page not found',
      content: 'If you entered a web address please check it was correct.'
    });
  } else {
    next(error);
  }
};

export const internalServer = (error, request, response, next) => { // eslint-disable-line no-unused-vars
  response.status(error.status || 500);

  if (request.accepts('json') && error.json) {
    response.json(error.json);
  } else {
    response.send(error.message);
  }
};
