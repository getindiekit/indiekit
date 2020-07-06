import httpError from 'http-errors';

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
    try {
      const {query} = request;

      if (!query.q) {
        throw new Error('Invalid query');
      }

      switch (query.q) {
        case 'last': {
          // Return last uploaded media file
          const items = await publication.media.selectFromAll('url');
          return response.json(items ? {url: items[0]} : {});
        }

        default:
          throw new Error(`Invalid parameter: ${query.q}`);
      }
    } catch (error) {
      next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
