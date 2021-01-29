import Debug from 'debug';
import httpError from 'http-errors';
import got from 'got';
import {getMicropubEndpoint, getPostData} from '../utils.js';

const debug = new Debug('indiekit:endpoint-syndicate');

export const syndicateController = publication => ({
  async post(request, response, next) {
    try {
      const syndication = [];

      // Get syndication targets
      const {syndicationTargets} = publication;
      if (syndicationTargets.length === 0) {
        return response.json({
          success: 'OK',
          success_description: 'No syndication targets have been configured'
        });
      }

      // Get post data
      const {url} = request.query;
      const postData = await getPostData(publication, url);

      if (!postData && url) {
        return response.json({
          success: 'OK',
          success_description: `No post record available for ${url}`
        });
      }

      if (!postData) {
        return response.json({
          success: 'OK',
          success_description: 'No post records available'
        });
      }

      // Only syndicate to selected targets
      const syndicateTo = postData.properties['mp-syndicate-to'];
      if (!syndicateTo) {
        return response.json({
          success: 'OK',
          success_description: 'No posts awaiting syndication'
        });
      }

      // Syndicate to target(s)
      for await (const target of syndicationTargets) {
        const canSyndicate = syndicateTo.includes(target.uid);
        if (canSyndicate) {
          const syndicatedUrl = await target.syndicate(postData.properties);
          syndication.push(syndicatedUrl);
        }
      }

      // Update post with syndicated URL(s) and removal of syndication target(s)
      const micropubEndpoint = getMicropubEndpoint(publication, request);
      const updated = await got.post(micropubEndpoint, {
        responseType: 'json',
        headers: {
          authorization: `Bearer ${request.query.token}`
        },
        json: {
          action: 'update',
          url: postData.properties.url,
          delete: ['mp-syndicate-to'],
          add: {
            syndication
          }
        }
      });

      if (updated) {
        return response.status(updated.statusCode).json(updated.body);
      }
    } catch (error) {
      debug(error);
      if (error.response) {
        next(httpError(error.response.statusCode, error.response.body.error_description));
      } else {
        next(httpError(error));
      }
    }
  }
});
