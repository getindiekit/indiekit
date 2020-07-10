import httpError from 'http-errors';
import {media} from '../lib/media.js';
import {mediaData} from '../lib/media/data.js';
import {checkScope} from '../lib/scope.js';

export const uploadController = publication => {
  /**
   * Upload file
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  return async (request, response, next) => {
    const {file} = request;
    const {scope} = publication.accessToken;

    try {
      checkScope(scope);

      const data = await mediaData.create(publication, file);
      const uploaded = await media.upload(publication, data, file);

      return response.status(uploaded.status).location(uploaded.location).json(uploaded.json);
    } catch (error) {
      // TODO: Remove this temporary fix
      const status = error.status || 400;
      next(httpError(status, error.message, {
        json: {
          error: error.value,
          error_description: error.message,
          scope: error.scope
        }
      }));
    }
  };
};
