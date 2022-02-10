export const login = (request, response) => {
  if (request.session.token) {
    return response.redirect("/");
  }

  return response.render("session/login", {
    title: response.__("session.login.title"),
    referrer: request.query.referrer,
  });
};

export const logout = (request, response) => {
  request.session = null;
  return response.redirect("/");
};
