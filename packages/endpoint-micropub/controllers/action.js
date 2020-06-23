import httpError from 'http-errors';
import {formEncodedToMf2} from '../lib/microformats.js';
import {getAction} from '../lib/micropub.js';
import {Post} from '../lib/post.js';
import {createPostData, readPostData} from '../lib/post/data.js';

export const actionController = publication => {
  return async (request, response, next) => {
    const action = request.query.action || request.body.action;
    const {body} = request;
    const url = request.query.url || request.body.url;
    const scope = action || 'create'; // TODO: Get from IndieAuth token

    try {
      const requestedAction = getAction(scope, action, url);
      const mf2 = request.is('json') ? body : formEncodedToMf2(body);
      const postData = url ? await readPostData(url, publication) : createPostData(mf2, publication);
      const post = new Post(publication);
      const result = await post[requestedAction](postData);
      return response.status(result.status).location(result.location).json(result);
    } catch (error) {
      return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
