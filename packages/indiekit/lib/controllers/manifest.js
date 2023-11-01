export const get = async (request, response) => {
  const { application } = request.app.locals;

  return response.type("application/manifest+json").json({
    $schema: "https://json.schemastore.org/web-manifest-combined.json",
    lang: application.locale,
    name: application.name,
    theme_color: application.themeColor,
    icons: [
      {
        src: "assets/icon.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        src: "assets/app.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  });
};
