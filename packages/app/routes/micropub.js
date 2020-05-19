import express from 'express';
import httpError from 'http-errors';
import * as publicationController from '../controllers/publication.js';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response, next) => {
  const config = await publicationController.config();

  // Use default media endpoint if not configured
  config['media-endpoint'] =
  config['media-endpoint'] ||
    `${request.protocol}://${request.headers.host}/media`;

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
