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
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .attach('file', gif);
  t.is(response.status, 201);
  scope.done();
});

test('Returns 400 if no file attached to request', async t => {
  const {app} = t.context;
  const response = await app.post('/media')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 400);
  t.is(response.body.error, 'invalid_request');
});
