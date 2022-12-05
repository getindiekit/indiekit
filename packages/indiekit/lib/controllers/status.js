export const viewStatus = (request, response) => {
  const { scope } = request.session;

  response.render("status", {
    title: response.__("status.title"),
    scope: scope?.split(" "),
    actions: [
      {
        text: response.__("status.application.installedPlugins"),
        href: "/plugins/",
      },
    ],
  });
};
