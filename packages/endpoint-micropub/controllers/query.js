import httpError from 'http-errors';
import {url2Mf2, mf2Properties} from '../lib/microformats.js';
import {getConfig} from '../lib/config.js';

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
    const config = getConfig(publication.config);
    const {query} = request;

    try {
      if (!query.q) {
        throw new Error('Invalid query');
      }

      switch (query.q) {
        case 'config': {
          return response.json(config);
        }

        case 'category': {
          return response.json({
            categories: config.categories
          });
        }

        case 'source': {
          // Return microformats for a given source URL
          if (query.url) {
            const mf2 = await url2Mf2(query.url);
            const properties = mf2Properties(mf2, query.properties);
            return response.json(properties);
          }

          // Return microformats for previously published posts
          const items = await publication.posts.selectFromAll('jf2');
          return response.json({items});
        }

        default: {
          if (config[query.q]) {
            return response.json({
              [query.q]: config[query.q]
            });
          }

          throw new Error(`Invalid parameter: ${query.q}`);
        }
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
