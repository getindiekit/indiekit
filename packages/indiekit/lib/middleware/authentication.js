export const authenticate = (request, response, next) => {
  if (request.session && request.session.token) {
    return next();
  }

  return response.redirect(`/session/login?redirect=${request.originalUrl}`);
};
