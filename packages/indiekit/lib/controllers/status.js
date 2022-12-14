export const viewStatus = (request, response) => {
  const { access_token, scope } = request.session;

  response.render("status", {
    title: response.__("status.title"),
    accessToken: access_token,
    scope: scope?.split(" "),
    actions: [
      {
        text: response.__("status.application.installedPlugins"),
        href: "/plugins/",
      },
    ],
  });
};
