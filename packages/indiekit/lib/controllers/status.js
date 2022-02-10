export const viewStatus = (request, response) =>
  response.render("status", {
    title: response.__("status.title"),
  });
