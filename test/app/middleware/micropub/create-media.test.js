const path = require('path');
const fs = require('fs-extra');
const test = require('ava');
const nock = require('nock');
const request = require('supertest');

const config = require(process.env.PWD + '/app/config');
const outputDir = process.env.PWD + '/.ava_output/micropub-media';

test.beforeEach(t => {
  config.data.dir = outputDir;
  t.context.app = request(require(process.env.PWD + '/app/server'));
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Creates a media file', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .reply(200, {
      type: 'file',
      encoding: 'base64',
      name: /\b[\d\w]{5}\b.gif/g,
      path: /\b[\d\w]{5}\b.gif/g,
      content: 'R0lGODlhAQABAIABAP8AAAAAACwAAAAAAQABAAACAkQBADs='
    });

  // Setup
  const {app} = t.context;
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

test.skip('Throws error creating media if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .replyWithError('Not found');

  // Setup
  const {app} = t.context;
  const image = path.resolve(__dirname, 'fixtures/image.gif');
  const response = await app.post('/media')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .attach('photo', image);

  // Test assertions
  t.is(response.status, 500);
  t.is(response.body.error, 'error');
  t.regex(response.body.error_description, /\bNot found\b/);
  scope.done();
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
