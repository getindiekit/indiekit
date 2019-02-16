const fetch = require('node-fetch');

const micropub = require(__basedir + '/app/functions/micropub');

exports.getAuthorizationResponse = async function (token) {
  const tokenEndpoint = process.env.TOKEN_ENDPOINT || 'https://tokens.indieauth.com/token';

  return fetch(tokenEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error('error', error);
      return micropub.error('forbidden');
    });
};
