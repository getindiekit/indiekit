import httpError from "http-errors";
import { media } from "../media.js";
import { mediaData } from "../media-data.js";
import { checkScope } from "../scope.js";

/**
 * Upload file
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP response
 * @param {Function} next Next middleware callback
 * @returns {object} HTTP response
 */
export const uploadController = async (request, response, next) => {
  const { file } = request;
  const { publication } = request.app.locals;
  const { scope } = request.session;

  try {
    checkScope(scope);

    const data = await mediaData.create(publication, file);
    const uploaded = await media.upload(publication, data, file);

    return response
      .status(uploaded.status)
      .location(uploaded.location)
      .json(uploaded.json);
  } catch (error) {
    next(httpError(error.statusCode, error.message));
  }
};
