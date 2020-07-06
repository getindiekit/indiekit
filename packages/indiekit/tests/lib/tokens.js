import test from 'ava';
import nock from 'nock';
import {
  getBearerToken,
  requestAccessToken,
  verifyAccessToken
} from '../../lib/tokens.js';

test.beforeEach(t => {
  t.context = {
    accessToken: {
      me: 'https://website.example',
      scope: 'create update delete media'
    },
    bearerToken: 'JWT',
    me: 'https://website.example',
    tokenEndpoint: 'https://tokens.indieauth.com/token'
  };
});

test('Returns bearer token from `headers.authorization`', t => {
  const request = {headers: {authorization: `Bearer ${t.context.bearerToken}`}};
  const result = getBearerToken(request);
  t.is(result, 'JWT');
});

test('Returns bearer token from `body.access_token`', t => {
  const request = {body: {access_token: t.context.bearerToken}}; // eslint-disable-line camelcase
  const result = getBearerToken(request);
  t.is(result, 'JWT');
});

test('Throws error if no bearer token provided by request', t => {
  const error = t.throws(() => getBearerToken({}));
  t.is(error.message, 'No bearer token provided by request');
});

test('Requests an access token', async t => {
  const scope = nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, t.context.accessToken);
  const result = await requestAccessToken(t.context.tokenEndpoint, t.context.bearerToken);
  t.is(result.me, 'https://website.example');
  t.is(result.scope, 'create update delete media');
  scope.done();
});

test('Token endpoint refuses to grant an access token', async t => {
  const scope = nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(400, {
      error_description: 'The token provided was malformed' // eslint-disable-line camelcase
    });
  const error = await t.throwsAsync(
    requestAccessToken(t.context.tokenEndpoint, 'malformed_token')
  );
  t.is(error.message, 'The token provided was malformed');
  scope.done();
});

test('Throws error contacting token endpoint', async t => {
  const scope = nock('https://tokens.indieauth.com')
    .get('/token')
    .replyWithError('not found');
  const error = await t.throwsAsync(
    requestAccessToken(t.context.tokenEndpoint, t.context.bearerToken)
  );
  t.is(error.message, 'not found');
  scope.done();
});

test('Throws error requesting an access token without bearer', async t => {
  const error = await t.throwsAsync(
    requestAccessToken(t.context.tokenEndpoint, null)
  );
  t.is(error.message, 'No bearer token provided in request');
});

test('Verifies an access token', async t => {
  const result = await verifyAccessToken(t.context.me, t.context.accessToken);
  t.is(result.me, 'https://website.example');
});

test('Throws error verifying access token', async t => {
  const error = await t.throwsAsync(
    verifyAccessToken(null, t.context.accessToken)
  );
  t.is(error.message, 'Cannot read property \'trim\' of null');
});

test('Throws error verifying access token without permissions', async t => {
  const error = await t.throwsAsync(
    verifyAccessToken('https://another.example', t.context.accessToken)
  );
  t.is(error.message, 'User does not have permission to perform request');
});

test('Throws error verifying incomplete access token', async t => {
  const error = await t.throwsAsync(
    verifyAccessToken(t.context.me, {})
  );
  t.is(error.message, 'There was a problem with this access token');
});
