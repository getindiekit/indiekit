import path from "node:path";

import { IndiekitError } from "@indiekit/error";

import { getFileProperties, getFileName } from "../utils.js";

export const fileData = {
  upload(request, response, next) {
    const { access_token, scope } = request.session;

    response.locals = {
      accessToken: access_token,
      filesPath: path.dirname(request.baseUrl + request.path),
      scope,
      ...response.locals,
    };

    next();
  },

  async read(request, response, next) {
    try {
      const { application } = request.app.locals;
      const { uid } = request.params;
      const { access_token, scope } = request.session;

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
