const _ = require('lodash');

const microformats = require(process.env.PWD + '/app/lib/microformats');
const response = require(process.env.PWD + '/app/lib/micropub/response');

/**
 * Returns an object containing information about this application
 *
 * @param {String} request HTTP request object
 * @param {String} publication Publication configuration
 * @returns {Promise} Query object
 */
module.exports = async (request, publication) => {
  const url = `${request.protocol}://${request.headers.host}`;
  const mediaEndpoint = publication['media-endpoint'] || `${url}/media`;
  const syndicateTo = publication['syndicate-to'];
  let postTypes = [];

  if (publication['post-types']) {
    postTypes = publication['post-types'].map(postType => {
      return _.pick(postType, ['name', 'type']);
    });
  }

  const {query} = request;
  if (query.q === 'config') {
    return {
      code: 200,
      body: {
        'media-endpoint': mediaEndpoint,
        'syndicate-to': syndicateTo,
        'post-types': postTypes
      }
    };
  }

  if (query.q === 'source') {
    try {
      return {
        code: 200,
        body: await microformats.urlToMf2(query.url, query.properties)
      };
    } catch (error) {
      return response.error('invalid_request', error.message);
    }
  }

  if (query.q === 'syndicate-to') {
    return {
      code: 200,
      body: {
        'syndicate-to': syndicateTo
      }
    };
  }

  return response.error('invalid_request');
};
