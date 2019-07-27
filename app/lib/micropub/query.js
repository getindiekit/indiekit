const logger = require(process.env.PWD + '/app/logger');
const microformats = require(process.env.PWD + '/app/lib/microformats');
const publication = require(process.env.PWD + '/app/lib/publication');

/**
 * Returns an object containing information about this application
 *
 * @memberof micropub
 * @module query
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {Promise} Express response object
 */
module.exports = async (req, res) => {
  const {pub} = await req.app.locals;
  const endpointBaseUrl = `${req.protocol}://${req.headers.host}`;

  const endpointConfig = {
    categories: await publication.getCategories(pub),
    'media-endpoint': pub['media-endpoint'] || `${endpointBaseUrl}/media`,
    'post-types': publication.getPostTypes(pub),
    'syndicate-to': pub['syndicate-to']
  };

  const {query} = req;
  switch (query.q) {
    case 'config': {
      return res.json(endpointConfig);
    }

    case 'category': {
      return res.json({
        categories: endpointConfig.categories
      });
    }

    case 'source': {
      try {
        return res.json(
          await microformats.urlToMf2(query.url, query.properties)
        );
      } catch (error) {
        const error_description = `Unable to answer query. ${error.message}`;
        logger.error('micropub.query: %s', error_description);
        return res.status(400).json({
          error: 'invalid_request',
          error_description
        });
      }
    }

    default: {
      // Check if the query is a property in the config object
      if (typeof query.q === 'string' && endpointConfig[query.q]) {
        return res.json({
          [query.q]: endpointConfig[query.q]
        });
      }

      const error_description = 'Request is missing required parameter, or there was a problem with value of one of the parameters provided';
      logger.error('micropub.query: %s', error_description);
      return res.status(400).json({
        error: 'invalid_request',
        error_description
      });
    }
  }
};
