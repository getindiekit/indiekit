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

test('Throws error creating post attachment if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .replyWithError('not found');

  // Setup
  const image = path.resolve(__dirname, 'fixtures/image.gif');
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .field('h', 'entry')
    .field('content', 'Creates a post file with attachment')
    .attach('photo', image);

  // Test assertions
  t.is(response.status, 500);
  t.is(response.body.error, 'error');
  t.regex(response.body.error_description, /\bnot found\b/);
  scope.done();
});
