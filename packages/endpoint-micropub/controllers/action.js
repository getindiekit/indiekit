import httpError from 'http-errors';
import {formEncodedToMf2} from '../services/transform-request.js';
import {deriveAction} from '../services/action.js';
import {Post} from '../lib/post.js';

export const actionController = publication => {
  return async (request, response, next) => {
    const action = request.query.action || request.body.action;
    const {body} = request;
    const url = request.query.url || request.body.url;
    const scope = 'create'; // TODO: Get from IndieAuth token
    const post = new Post(publication);

    try {
      const requestedAction = deriveAction(scope, action, url);
      const mf2 = request.is('json') ? body : formEncodedToMf2(body);
      const result = await post[requestedAction](mf2);
      return response.status(result.status).location(result.location).json(result);
    } catch (error) {
      return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
