export const viewHomepage = (request, response) => {
  if (request.session && request.session.token) {
    return response.redirect('/status');
  }

  return response.redirect('/session/login');
};
