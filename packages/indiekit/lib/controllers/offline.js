import { getServiceWorker } from "../utils.js";

/**
 * Get offline page
 * @type {RequestHandler}
 */
export const offline = (request, response) => {
  return response.render("offline", {
    title: response.locals.__("offline.title"),
  });
};

/**
 * Get service worker
 * @param {Request} request - Request
 * @param {Response} response - Response
 * @returns {Promise<Response>} Sent response
 */
export const serviceworker = async (request, response) => {
  const { application } = request.app.locals;
  const serviceworker = await getServiceWorker(application);

  return response.type("text/javascript").send(serviceworker).end();
};

/**
 * @import { Request, RequestHandler, Response } from "express"
 */
