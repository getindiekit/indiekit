import httpError from 'http-errors';
import {formEncodedToMf2} from '../lib/microformats.js';
import {processAttachments} from '../lib/post/attachments.js';
import {post} from '../lib/post.js';
import {postData} from '../lib/post/data.js';
import {checkScope} from '../lib/scope.js';

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
    const {body, files, query} = request;
    const action = query.action || body.action || 'create';
    const {scope} = response.locals.publication.token;
    const url = query.url || body.url;

    try {
      checkScope(scope, action);

      let mf2 = request.is('json') ? body : formEncodedToMf2(body);
      let data;
      let published;

      switch (action) {
        case 'create':
          mf2 = await processAttachments(publication, mf2, files);
          data = await postData.create(publication, mf2);
          published = await post.create(publication, data);
          break;
        case 'update':
          data = await postData.update(publication, url, body);
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
