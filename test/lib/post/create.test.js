const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');
const pub = require('./fixtures/create-config');

test.before(() => {
  config.data.dir = process.env.PWD + `/.ava_output/${test.meta.file}`;
});

test('Creates a note post', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .reply(200);

  // Setup
  const body = require('./fixtures/type-note');
  const created = await post.create(pub, body);

  // Test assertions
  t.truthy(validUrl.isUri(created.post.url));
  scope.done();
});

test('Creates a photo post', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .reply(200);

  // Setup
  const body = require('./fixtures/type-note');
  const photo = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const files = [{
    buffer: Buffer.from(photo),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  }];
  const created = await post.create(pub, body, files);

  // Test assertions
  t.truthy(validUrl.isUri(created.post.url));
  scope.done();
});

test('Throws error if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .replyWithError('not found');

  // Setup
  const body = require('./fixtures/type-note');
  const error = await t.throwsAsync(post.create(pub, body));

  // Test assertions
  t.regex(error.message.error_description, /\bnot found\b/);
  scope.done();
});
