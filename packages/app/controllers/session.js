export const login = (request, response) => {
  response.render('session/login', {
    title: 'Sign in',
    referrer: request.query.referrer
  });
};
