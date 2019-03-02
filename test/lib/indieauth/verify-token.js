const test = require('ava');

// Function
const verifyToken = require(process.env.PWD + '/app/lib/indieauth/verify-token.js');

// Tests
test('Verifies website URL against auth token', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const response = await verifyToken(accessToken, process.env.INDIEKIT_URL);
  t.is(response.me, process.env.INDIEKIT_URL);
});

test('Throws error if website URL doesn’t match that in auth token', async t => {
  const accessToken = process.env.TEST_INDIEAUTH_TOKEN;
  const error = await t.throwsAsync(verifyToken(accessToken, 'https://example.test'));
  t.regex(error.message, /does not match that provided by token$/g);
});
