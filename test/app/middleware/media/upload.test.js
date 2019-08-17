const path = require('path');
const test = require('ava');
const nock = require('nock');
const request = require('supertest');

const app = request(require(process.env.PWD + '/app/server'));
const config = require(process.env.PWD + '/app/config');

test.beforeEach(t => {
  config.data.dir = process.env.PWD + `/.ava_output/${test.meta.file}`;
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test.serial('Creates a media file', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .reply(200);

  // Setup
  const image = path.resolve(__dirname, 'fixtures/image.gif');
  const response = await app.post('/media')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .attach('file', image);

  // Test assertions
  t.is(response.status, 201);
  t.is(response.body.success, 'create');
  t.regex(response.header.location, /\b[\d\w]{5}\b.gif/g);
  scope.done();
});

test.serial('Throws error creating media if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .replyWithError('not found');

  // Setup
  const image = path.resolve(__dirname, 'fixtures/image.gif');
  const response = await app.post('/media')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .attach('file', image);

  // Test assertions
  t.is(response.status, 500);
  t.regex(response.body.error_description, /\bnot found\b/);
  scope.done();
});
