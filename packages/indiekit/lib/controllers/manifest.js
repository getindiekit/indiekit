import { getBackgroundColor, getThemeColor } from "@indiekit/frontend";
import { getShortcuts } from "../shortcuts.js";

export const get = async (request, response) => {
  const { application } = request.app.locals;

  response.set("Cache-Control", "public, max-age=604800"); // 7 days
  return response.type("application/manifest+json").json({
    $schema: "https://json.schemastore.org/web-manifest-combined.json",
    lang: application.locale,
    name: application.name,
    scope: "/",
    icons: [
      {
        src: "assets/app-icon-192-any.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "assets/app-icon-512-any.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "assets/app-icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    display: "standalone",
    start_url: "/?homescreen",
    id: "/?homescreen",
    theme_color: getThemeColor(application.themeColor),
    background_color: getBackgroundColor(application.themeColor),
    shortcuts: getShortcuts(application, response),
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
