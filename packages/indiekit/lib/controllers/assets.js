import { appIcon, shortcutIcon, scripts, styles } from "@indiekit/frontend";

/**
 * Get app icon
 * @param {Request} request - Request
 * @param {Response} response - Response
 * @param {NextFunction} next - Next
 * @returns {Promise<Response|undefined>} Sent response
 */
export const getAppIcon = async (request, response, next) => {
  const { purpose, size } = request.params;
  const { themeColor } = request.app.locals.application;

  try {
    const png = await appIcon(Number(size), themeColor, String(purpose));
    return response.type("image/png").send(png).end();
  } catch {
    next();
  }
};

/**
 * Get shortcut icon
 * @param {Request} request - Request
 * @param {Response} response - Response
 * @param {NextFunction} next - Next
 * @returns {Promise<Response|undefined>} Sent response
 */
export const getShortcutIcon = async (request, response, next) => {
  const { name, size } = request.params;

  try {
    const png = await shortcutIcon(Number(size), String(name));
    return response.type("image/png").send(png).end();
  } catch {
    next();
  }
};

/**
 * Get JavaScript file
 * @param {Request} request - Request
 * @param {Response} response - Response
 * @returns {Promise<Response>} Sent response
 */
export const getScripts = async (request, response) => {
  const js = await scripts();

  response.set("Cache-Control", "max-age=2147483648, immutable");
  return response.type("text/javascript").send(js).end();
};

/**
 * Get CSS file
 * @param {Request} request - Request
 * @param {Response} response - Response
 * @returns {Promise<Response>} Sent response
 */
export const getStyles = async (request, response) => {
  const css = await styles();

  response.set("Cache-Control", "max-age=2147483648, immutable");
  return response.type("text/css").send(css).end();
};

/**
 * @import { NextFunction, Request, Response } from "express"
 */
