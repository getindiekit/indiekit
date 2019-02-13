const config = require(__basedir + '/.cache/config.json');
const format = require(__basedir + '/app/functions/format');
const micropub = require(__basedir + '/app/functions/micropub');

/**
 * Respond to endpoint GET requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @return {Object} JSON response
 *
 */
exports.get = function (request, response) {
  const {q} = request.query;
  const mediaEndpoint = config['media-endpoint'] || `https://${request.headers.host}/media`;
  const syndicateTo = config['syndicate-to'] || [];

  switch (q) {
    case ('config'):
      return response.json({
        'media-endpoint': mediaEndpoint,
        'syndicate-to': syndicateTo
      });
    case ('source'):
      return micropub.errorResponse(response, 'not_supported');
    case ('syndicate-to'):
      return response.json({
        'syndicate-to': syndicateTo
      });
    default:
      return micropub.errorResponse(response);
  }
};

/**
 * Respond to endpoint POST requests
 *
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Next callback
 *
 */
exports.post = function (request, response, next) {
  const {body} = request;
  let mf2;

  if (body) {
    if (request.is('json')) {
      mf2 = body;
    } else {
      mf2 = micropub.convertFormEncodedToMf2(body);
    }
  }

  const template = format.template(mf2.properties);
  console.log(template);

  response.status(202).set({
    Location: 'TBD'
  }).json(mf2);

  next();
};
