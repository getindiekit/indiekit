export const get = async (request, response) => {
  const { application } = request.app.locals;

  return response.type("application/manifest+json").json({
    $schema: "https://json.schemastore.org/web-manifest-combined.json",
    lang: application.locale,
    name: application.name,
    icons: [
      {
        src: "assets/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "assets/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: application.shortcuts,
    ...(application.shareEndpoint && {
      share_target: {
        action: application.shareEndpoint,
        method: "GET",
        params: {
          title: "name",
          text: "content",
          url: "url",
        },
      },
    }),
  });
};
