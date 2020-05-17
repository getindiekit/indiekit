import express from 'express';
import httpError from 'http-errors';

export const router = express.Router(); // eslint-disable-line new-cap

import publicationController from '../controllers/publication.js';

router.get('/', async (request, response, next) => {
  const config = await publicationController();

  // Media endpoint
  const defaultMediaEndpoint = `${request.protocol}://${request.headers.host}/media`;
  config['media-endpoint'] = config['media-endpoint'] || defaultMediaEndpoint;

  // Post types
  const postTypes = config['post-types'];
  config['post-types'] = Object.keys(postTypes).map(key => ({
    type: key,
    name: postTypes[key].name
  }));

  try {
    const {query} = request;

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
    return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
  }
});
