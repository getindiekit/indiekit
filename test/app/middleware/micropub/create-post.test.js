const path = require('path');
const fs = require('fs-extra');
const test = require('ava');
const nock = require('nock');
const request = require('supertest');

const config = require(process.env.PWD + '/app/config');
const outputDir = process.env.PWD + '/.ava_output/micropub-post';

test.beforeEach(t => {
  config.data.dir = outputDir;
  t.context.app = request(require(process.env.PWD + '/app/server'));
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Creates a post file', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .reply(201);

  // Setup
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send('h=entry&content=Creates+a+post+file');

  // Test assertions
  t.is(response.status, 202);
  t.is(response.body.success, 'create_pending');
  t.regex(response.header.location, /\b[\d\w]{5}\b/g);
  scope.done();
});

test('Creates a post file with attachment', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .reply(201)
    .put(/\b[\d\w]{5}\b/g)
    .reply(200);

  // Setup
  const {app} = t.context;
  const image = path.resolve(__dirname, 'fixtures/image.gif');
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .field('h', 'entry')
    .field('content', 'Creates a post file with attachment')
    .attach('photo', image);

  // Test assertions
  t.is(response.status, 202);
  t.is(response.body.success, 'create_pending');
  t.regex(response.header.location, /\b[\d\w]{5}\b/g);
  scope.done();
});

test.skip('Throws error creating post if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .replyWithError('Not found');

  // Setup
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
    .send('h=entry&content=Throws+error+if+GitHub+responds+with+an+error');

  // Test assertions
  t.is(response.status, 500);
  t.is(response.body.error, 'error');
  t.regex(response.body.error_description, /\bNot found\b/);
  scope.done();
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
