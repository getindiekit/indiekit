import path from "node:path";

import { IndiekitError } from "@indiekit/error";

import { getFileProperties, getFileName } from "../utils.js";

export const fileData = {
  /**
   * Add data for a file upload to response locals
   * @param {Request} request - Express request
   * @param {Response} response - Express response
   * @param {NextFunction} next - Next middleware
   */
  upload(request, response, next) {
    const access_token = request.session?.access_token;
    const scope = request.session?.scope;

    response.locals = {
      accessToken: access_token,
      filesPath: path.dirname(request.baseUrl + request.path),
      scope,
      ...response.locals,
    };

    next();
  },

  /**
   * Add data for an uploaded file to response locals
   * @param {Request<{ uid: string, action?: string }>} request - Express request
   * @param {Response} response - Express response
   * @param {NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async read(request, response, next) {
    try {
      const { application } = request.app.locals;
      const { uid } = request.params;
      const access_token = request.session?.access_token;
      const scope = request.session?.scope;

      const properties = await getFileProperties(
        uid,
        application.mediaEndpoint,
        access_token,
      );

      if (!properties) {
        throw IndiekitError.notFound(response.locals.__("NotFoundError.page"));
      }

      response.locals = {
        accessToken: access_token,
        filesPath: path.dirname(request.baseUrl + request.path),
        fileName: getFileName(properties.url),
        properties,
        scope,
        ...response.locals,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
};

/**
 * @import { NextFunction, Request, Response } from "express"
 */
