import httpError from 'http-errors';
import {formEncodedToMf2, normaliseMf2} from '../lib/microformats.js';
import {post} from '../lib/post.js';
import {postData} from '../lib/post/data.js';
import {checkScope} from '../lib/scope.js';
import {uploadMedia, addMediaLocations} from '../lib/media.js';

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
    try {
      const {body, files, query} = request;
      const action = query.action || body.action || 'create';
      const url = query.url || body.url;

      // Check scope
      const {scope} = publication.accessToken;
      checkScope(scope, action);

      // Perform requested action
      let mf2;
      let data;
      let published;
      let uploads;

      // Upload attached files
      if (files) {
        uploads = await uploadMedia(publication, files);
      }

      switch (action) {
        case 'create':
          mf2 = request.is('json') ? body : formEncodedToMf2(body);
          mf2 = addMediaLocations(mf2, uploads);
          mf2 = normaliseMf2(mf2);
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
      next(httpError(400, error.message, {
        json: {
          error: 'invalid_request',
          error_description: error.message
        }
      }));
    }
  };
};
