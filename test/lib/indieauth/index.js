const test = require('ava');

// Function
const indieauth = require(process.env.PWD + '/app/lib/indieauth');

// Tests
test('Connects to token endpoint', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const response = await indieauth.verifyToken(accessToken);
  t.is(response.client_id, 'https://gimme-a-token.5eb.nl/');
});

test('Authenticates access token', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const response = await indieauth.verifyToken(accessToken);
  t.is(response.me, process.env.INDIEKIT_URL);
});

test('Authenticates access token with `Bearer` prefix', async t => {
  const accessToken = 'Bearer ' + process.env.TEST_INDIEAUTH_TOKEN;
  const response = await indieauth.verifyToken(accessToken);
  t.is(response.me, process.env.INDIEKIT_URL);
});

test('Returns error if publication URL doesn’t match that in auth token', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const response = await indieauth.verifyToken(accessToken, {
    pubUrl: 'https://example.test'
  });
  t.is(response.body.error_description, 'User does not have permission to perform request');
});

test('Returns error from token endpoint if access token malformed', async t => {
  const accessToken = 'Invalid';
  const response = await indieauth.verifyToken(accessToken, {
    pubUrl: 'https://example.test'
  });
  t.is(response.body.error_description, 'The token provided was malformed');
});

test('Throws error connecting to non-responsive token endpoint', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const error = await t.throwsAsync(indieauth.verifyToken(accessToken, {
    endpoint: 'https://tokens.example.test/token'
  }));
  t.regex(error.message, /^Unable to connect to/g);
});
