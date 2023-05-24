import { IndiekitError } from "@indiekit/error";
import { mediaContent } from "../media-content.js";
import { mediaData } from "../media-data.js";
import { checkScope } from "../scope.js";

/**
 * Perform requested file action
 * @type {import("express").RequestHandler}
 */
export const actionController = async (request, response, next) => {
  const { body, files, query } = request;
  const action = query.action || body.action || "media";
  const url = query.url || body.url;
  const { publication } = request.app.locals;

  try {
    // Check provided scope
    const { scope } = request.session;
    const hasScope = checkScope(scope);
    if (!hasScope) {
      throw IndiekitError.insufficientScope(
        response.__("ForbiddenError.insufficientScope"),
        { scope: action }
      );
    }

    let data;
    let content;
    switch (action) {
      case "media": {
        // Check for file in request
        if (!files || !files.file || files.file.truncated) {
          throw IndiekitError.badRequest(
            response.__("BadRequestError.missingProperty", "file")
          );
        }

        data = await mediaData.create(publication, files.file);
        content = await mediaContent.upload(publication, data, files.file);
        break;
      }

      case "delete": {
        // Check for URL if deleting a file
        if (action === "delete" && !url) {
          throw IndiekitError.badRequest(
            response.__("BadRequestError.missingParameter", "url")
          );
        }

        data = await mediaData.read(publication, url);
        content = await mediaContent.delete(publication, data);

        // Once file deleted from content store, delete data from database
        await mediaData.delete(publication, url);
        break;
      }

      default:
    }

    return response
      .status(content.status)
      .location(content.location)
      .json(content.json);
  } catch (error) {
    let nextError = error;

    // Hoist not found error to controller to localise response
    if (error.name === "NotFoundError") {
      nextError = IndiekitError.notFound(
        response.__("NotFoundError.record", error.message)
      );
    }

    // Hoist unsupported media type error to controller to localise response
    if (error.name === "UnsupportedMediaTypeError") {
      nextError = IndiekitError.unsupportedMediaType(
        response.__("UnsupportedMediaTypeError.type", error.message)
      );
    }

    // Hoist unsupported post type error to controller to localise response
    if (error.name === "NotImplementedError") {
      nextError = IndiekitError.notImplemented(
        response.__("NotImplementedError.postType", error.message),
        { uri: "https://getindiekit.com/configuration/post-types" }
      );
    }

    return next(nextError);
  }
};
