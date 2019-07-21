const config = require(process.env.PWD + '/app/config');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const publication = require(process.env.PWD + '/app/lib/publication');

/**
 * Returns an object containing information about this application
 *
 * @memberof micropub
 * @module query
 * @param {Object} request HTTP request object
 * @param {Object} response HTTP response object
 * @returns {Promise} Query object
 */
module.exports = async (request, response) => {
  const pub = await publication.resolveConfig(config['pub-config']);
  const endpointBaseUrl = `${request.protocol}://${request.headers.host}`;
  const endpointConfig = {
    'media-endpoint': pub['media-endpoint'] || `${endpointBaseUrl}/media`,
    'syndicate-to': pub['syndicate-to'],
    'post-types': publication.getPostTypes(pub)
  };

  const {query} = request;
  switch (query.q) {
    case 'config': {
      return response.status(200).json(endpointConfig);
    }

    case 'source': {
      try {
        return response.status(200).json(
          await microformats.urlToMf2(query.url, query.properties)
        );
      } catch (error) {
        return response.status(400).json({
          error: 'invalid_request',
          error_description: error.message // eslint-disable-line camelcase
        });
      }
    }

    default: {
      // Check if the query is a property in the config object
      if (typeof query.q === 'string' && endpointConfig[query.q]) {
        return response.status(200).json({
          [query.q]: endpointConfig[query.q]
        });
      }

      return response.status(400).json({
        error: 'invalid_request',
        error_description: 'Request is missing required parameter, or there was a problem with value of one of the parameters provided' // eslint-disable-line camelcase
      });
    }
  }
};
