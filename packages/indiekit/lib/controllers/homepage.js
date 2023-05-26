export const viewHomepage = (request, response) => {
  response.render("homepage", {
    title: response.locals.__("homepage.title"),
  });
};
