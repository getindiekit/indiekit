/* eslint camelcase: 0 */

/**
 * Returns error information
 *
 * @memberof micropub
 * @module error
 * @param {String} id Identifier
 * @param {String} desc Description
 * @returns {Object} Error object
 */
module.exports = (id, desc) => {
  let code;

  switch (id) {
    case ('not_found'):
      code = 404;
      desc = desc || 'Resource not found';
      break;
    case ('forbidden'):
      code = 403;
      desc = desc || 'User does not have permission to perform request';
      break;
    case ('unauthorized'):
      code = 401;
      desc = desc || 'No access token provided in request';
      break;
    case ('insufficient_scope'):
      code = 401;
      desc = desc || 'Scope of access token does not meet requirements for request';
      break;
    case ('invalid_request'):
      code = 400;
      desc = desc || 'Request is missing required parameter, or there was a problem with value of one of the parameters provided';
      break;
    default:
      id = 'server_error';
      code = 500;
      desc = desc || 'Server error';
  }

  return {
    code,
    body: {
      error: id,
      error_description: desc
    }
  };
};
