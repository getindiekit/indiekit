import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { getFileData, getFileName } from "../utils.js";

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
      const { id } = request.params;
      const { access_token, scope } = request.session;

      const data = await getFileData(
        id,
        application.mediaEndpoint,
        access_token,
      );

      response.locals = {
        accessToken: access_token,
        data,
        filesPath: path.dirname(request.baseUrl + request.path),
        fileName: getFileName(data.url),
        scope,
        ...response.locals,
      };

      next();
    } catch (error) {
      let nextError = error;

      if (error.message === "Invalid URL") {
        nextError = IndiekitError.notFound(
          response.locals.__("NotFoundError.page"),
        );
      }

      next(nextError);
    }
  },
};
