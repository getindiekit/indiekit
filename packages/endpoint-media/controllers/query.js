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
    const {query} = request;

    try {
      if (!query.q) {
        throw new Error('Invalid query');
      }

      switch (query.q) {
        case 'last': {
          // Return last uploaded media file
          const items = await publication.media
            .find()
            .sort({'properties.uploaded': -1})
            .toArray();
          return response.json(items ? {url: items[0].url} : {});
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
