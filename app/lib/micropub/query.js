const microformats = require(process.env.PWD + '/app/lib/microformats');
const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Returns an object containing information about this application
 *
 * @memberof micropub
 * @module query
 * @param {String} request HTTP request object
 * @param {String} pub Publication configuration
 * @returns {Promise} Query object
 */
module.exports = async (request, pub) => {
  const url = `${request.protocol}://${request.headers.host}`;
  const mediaEndpoint = pub['media-endpoint'] || `${url}/media`;
  const syndicateTo = pub['syndicate-to'];
  const pubPostTypes = pub['post-types'];
  const postTypes = [];

  if (pubPostTypes) {
    for (const [key, value] of Object.entries(pubPostTypes)) {
      const postType = {
        type: key,
        name: value.name
      };
      postTypes.push(postType);
    }
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
      return utils.error('invalid_request', error.message);
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

  return utils.error('invalid_request');
};
