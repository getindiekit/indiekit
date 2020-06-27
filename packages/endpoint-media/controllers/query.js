import httpError from 'http-errors';

export const queryController = publication => {
  /**
   * Query endpoint
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} Query result
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
          return response.json(items ? {items} : {});
        }

        default:
      }
    } catch (error) {
      return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
