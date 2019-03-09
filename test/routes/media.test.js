const path = require('path');
const nock = require('nock');
const test = require('ava');
const request = require('supertest');

// Tests
test.before(t => {
  t.context.app = request(require(process.env.PWD + '/app/server'));
});

test('Uploads image to media endpoint', async t => {
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(200, {
      type: 'file',
      encoding: 'base64',
      name: /\b[\d\w]{5}\b.gif/g,
      path: /\b[\d\w]{5}\b.gif/g,
      content: 'R0lGODlhAQABAIABAP8AAAAAACwAAAAAAQABAAACAkQBADs='
    });
  const gif = path.resolve(__dirname, 'fixtures/image.gif');
  const {app} = t.context;
  const response = await app.post('/media')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .attach('file', gif);
  t.is(response.status, 201);
  scope.done();
});

test('Returns 400 if no file attached to request', async t => {
  const {app} = t.context;
  const response = await app.post('/media')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 400);
  t.is(response.body.error, 'invalid_request');
});

test('Returns 401 if access token doesn’t provide sufficient scope', async t => {
  const gif = path.resolve(__dirname, 'fixtures/image.gif');
  const {app} = t.context;
  const response = await app.post('/media')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN_NOT_SCOPED}`)
    .attach('file', gif);
  t.is(response.status, 401);
  t.is(response.body.error, 'insufficient_scope');
});

test('Returns 401 if access token is invalid', async t => {
  const gif = path.resolve(__dirname, 'fixtures/image.gif');
  const {app} = t.context;
  const response = await app.post('/media')
    .set('authorization', 'Bearer invalid')
    .attach('file', gif);
  t.is(response.status, 401);
  t.is(response.body.error, 'unauthorized');
});
