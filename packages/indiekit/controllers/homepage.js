export const viewHomepage = (request, response) => {
  if (request.session.token) {
    response.redirect('/status');
  }

  response.redirect('/session/login');
};
