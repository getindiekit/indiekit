export const authenticate = (request, response, next) => {
  if (request.session && request.session.token) {
    return next();
  }

  response.redirect(`/session/login?redirect=${request.originalUrl}`);
};
