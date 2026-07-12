/**
 * Get status page
 * @type {RequestHandler}
 */
export const viewStatus = (request, response) => {
  const { scope } = request.app.locals;

  return response.render("status", {
    title: response.locals.__("status.title"),
    scope: scope?.split(" "),
    actions: [
      {
        text: response.locals.__("status.application.installedPlugins"),
        href: "/plugins/",
      },
    ],
  });
};

/**
 * @import { RequestHandler } from "express"
 */
