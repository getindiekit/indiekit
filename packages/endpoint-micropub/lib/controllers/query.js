import Debug from 'debug';
import httpError from 'http-errors';
import {url2Mf2, mf2Properties} from '../microformats.js';
import {getConfig, queryList} from '../query.js';

const debug = new Debug('indiekit:error');

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
    const {application} = response.locals;
    const config = getConfig(application, publication);
    const {query} = request;
    const {filter, limit, offset} = query;

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
            categories: queryList(config.categories, {filter, limit, offset})
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
          const items = publication.posts ?
            await publication.posts.find().map(post => post.mf2).toArray() :
            [];
          return response.json({
            items: queryList(items, {filter, limit, offset})
          });
        }

        default: {
          if (config[query.q]) {
            return response.json({
              [query.q]: queryList(config[query.q], {filter, limit, offset})
            });
          }

          throw new Error(`Invalid parameter: ${query.q}`);
        }
      }
    } catch (error) {
      debug(error);
      next(httpError(400, error));
    }
  };
};
