import httpError from 'http-errors';
import {createMediaData} from '../lib/media/data.js';
import {Media} from '../lib/media.js';

export const uploadController = publication => {
  /**
   * Upload endpoint
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} Query result
   */
  return async (request, response, next) => {
    const {file} = request;

    try {
      const mediaData = await createMediaData(file, publication);
      const media = new Media(publication, mediaData);
      const result = await media.upload(file);
      return response.status(result.status).location(result.location).json(result);
    } catch (error) {
      return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
