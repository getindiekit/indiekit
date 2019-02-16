const fetch = require('node-fetch');

exports.getAuthorizationResponse = async function (token) {
  const tokenEndpoint = process.env.TOKEN_ENDPOINT || 'https://tokens.indieauth.com/token';
  const isValidToken = token.startsWith('Bearer ');

  if (!isValidToken) {
    token = 'Bearer ' + token;
  }

  return fetch(tokenEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token
    }
  }).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw response.statusText;
  }).catch(error => {
    console.error('IndieAuth token endpoint:', error);
  });
};
