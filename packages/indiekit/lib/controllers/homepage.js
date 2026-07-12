/**
 * Get homepage
 * @type {RequestHandler}
 */
export const viewHomepage = (request, response) => {
  return response.render("homepage", {
    title: response.locals.__("homepage.title"),
  });
};

/**
 * @import { RequestHandler } from "express"
 */
