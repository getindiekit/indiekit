const test = require('ava');

// Function
const request = require(process.env.PWD + '/app/lib/indieauth/request.js');

// Tests
test('Connects to token endpoint', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const response = await request(accessToken);
  t.is(response.client_id, 'https://gimme-a-token.5eb.nl/');
});

test('Authenticates access token (with `Bearer` prefix) with token endpoint', async t => {
  let accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  accessToken = 'Bearer ' + accessToken;
  const response = await request(accessToken);
  t.is(response.me, process.env.INDIEKIT_URL);
});

test('Throws error connecting to non-responsive token endpoint', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const error = await t.throwsAsync(request(accessToken, 'https://tokens.example.test/token'));
  t.regex(error.message, /^Unable to connect to/g);
});
