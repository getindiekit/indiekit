export const login = (request, response) => {
  if (request.session.access_token) {
    return response.redirect("/");
  }

  return response.render("session/login", {
    title: response.locals.__("session.login.title"),
    referrer: request.query.referrer,
  });
};

export const logout = (request, response) => {
  request.session = undefined;
  return response.redirect("/");
};
