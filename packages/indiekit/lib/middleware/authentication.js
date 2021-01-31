export const authenticate = (request, response, next) => {
  const hasToken = request.session && request.session.token;
  const disabled = process.env.DISABLE_AUTH;

  if (hasToken || disabled) {
    return next();
  }

  return response.redirect(`/session/login?redirect=${request.originalUrl}`);
};
