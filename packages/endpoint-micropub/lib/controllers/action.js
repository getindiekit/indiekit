import Debug from 'debug';
import httpError from 'http-errors';
import {formEncodedToMf2, getMf2} from '../microformats.js';
import {post} from '../post.js';
import {postData} from '../post-data.js';
import {checkScope} from '../scope.js';
import {uploadMedia} from '../media.js';

const debug = new Debug('indiekit:error');

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
    const url = query.url || body.url;
    const {scope} = publication.accessToken;

    try {
      checkScope(scope, action);

      let mf2;
      let data;
      let published;
      switch (action) {
        case 'create':
          // Create and normalise Microformats2 data
          // TODO: Attached photos don’t appear with correct alt text
          mf2 = request.is('json') ? body : formEncodedToMf2(body);
          mf2 = files ? await uploadMedia(publication, mf2, files) : mf2;
          mf2 = getMf2(publication, mf2);

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

      return response.status(published.status).location(published.location).json(published.json);
    } catch (error) {
      debug(error);
      next(httpError(error.statusCode, error, {
        scope: error.scope
      }));
    }
  };
};
