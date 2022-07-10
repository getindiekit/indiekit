import { IndiekitError } from "@indiekit/error";
import { media } from "../media.js";
import { mediaData } from "../media-data.js";
import { checkScope } from "../scope.js";

/**
 * Upload file
 *
 * @param {object} request - HTTP request
 * @param {object} response - HTTP response
 * @param {Function} next - Next middleware callback
 * @returns {object} HTTP response
 */
export const uploadController = async (request, response, next) => {
  const { publication } = request.app.locals;

  try {
    // Check for file in request
    const { file } = request;
    if (!file || file.truncated || !file.buffer) {
      throw IndiekitError.badRequest(
        response.__("BadRequestError.missingProperty", "file")
      );
    }

    // Check provided scope
    const { scope } = request.session;
    const hasScope = checkScope(scope);
    if (!hasScope) {
      throw IndiekitError.insufficientScope(
        response.__("ForbiddenError.insufficientScope"),
        { scope: "create media" }
      );
    }

    const data = await mediaData.create(publication, file);
    const uploaded = await media.upload(publication, data, file);

    return response
      .status(uploaded.status)
      .location(uploaded.location)
      .json(uploaded.json);
  } catch (error) {
    let nextError = error;

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
        { uri: "https://getindiekit.com/customisation/post-types/" }
      );
    }

    return next(nextError);
  }
};
