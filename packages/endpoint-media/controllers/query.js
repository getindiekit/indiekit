import httpError from 'http-errors';
import {queryList} from '../lib/query.js';

export const queryController = publication => {
  /**
   * Query endpoint
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  return async (request, response, next) => {
    const {query} = request;
    const {filter, limit, offset} = query;

    try {
      if (!query.q) {
        throw new Error('Invalid query');
      }

      switch (query.q) {
        case 'source': {
          // Return previously uploaded media
          const items = await publication.media
            .find()
            .map(media => media.properties)
            .toArray();
          return response.json({
            items: queryList(items, {filter, limit, offset})
          });
        }

        default:
          throw new Error(`Invalid parameter: ${query.q}`);
      }
    } catch (error) {
      next(httpError(400, error.message, {
        json: {
          error: 'invalid_request',
          error_description: error.message
        }
      }));
    }
  };
};
