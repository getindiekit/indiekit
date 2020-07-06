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
    const {scope} = response.locals.publication.token;

    try {
      checkScope(scope);

      const data = await mediaData.create(publication, file);
      const uploaded = await media.upload(publication, data, file);

      return response.status(uploaded.status).location(uploaded.location).json(uploaded);
    } catch (error) {
      next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
