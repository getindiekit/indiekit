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
      const {scope} = response.locals.publication.token;
      checkScope(scope, action);

      // Perform requested action
      let mf2;
      let data;
      let published;

      // Upload attached files
      if (files) {
        const mediaEndpoint = publication.config['media-endpoint'];
        const uploads = await uploadMedia(mediaEndpoint, files);
        mf2 = addMediaLocations(mf2, uploads);
      }

      switch (action) {
        case 'create':
          mf2 = request.is('json') ? body : formEncodedToMf2(body);
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

      return response.status(published.status).location(published.location).json(published);
    } catch (error) {
      next(httpError.BadRequest(error.message)); // eslint-disable-line new-cap
    }
  };
};
