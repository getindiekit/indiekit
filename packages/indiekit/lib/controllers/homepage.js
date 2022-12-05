export const viewHomepage = (request, response) => {
  response.render("homepage", {
    title: response.__("homepage.title"),
  });
};
