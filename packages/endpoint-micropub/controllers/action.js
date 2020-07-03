import httpError from 'http-errors';
import {formEncodedToMf2} from '../lib/microformats.js';
import {getAction} from '../lib/micropub.js';
import {post} from '../lib/post.js';
import {postData} from '../lib/post/data.js';

export const actionController = publication => {
  /**
   * Perform requested post action
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  return async (request, response, next) => {
    const action = request.query.action || request.body.action;
    const {body, files} = request;
    const mf2 = request.is('json') ? body : formEncodedToMf2(body);
    const operation = request.body;
    const scope = action || 'create'; // TODO: Get from IndieAuth token
    const url = request.query.url || request.body.url;

    try {
      let data;
      let published;

      const requestedAction = getAction(scope, action, url);
      switch (requestedAction) {
        case 'create':
          data = await postData.create(publication, mf2);
          published = await post.create(publication, data, files);
          break;
        case 'update':
          data = await postData.update(publication, url, operation);
          published = await post.update(publication, data, url);
          break;
        case 'delete':
          data = await postData.read(publication, url);
          published = await post.delete(publication, data);
          break;
        case 'undelete':
          data = await postData.read(publication, url);
          published = await post.undelete(publication, data);
          break;
        default:
      }

      return response.status(published.status).location(published.location).json(published);
    } catch (error) {
      return next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
