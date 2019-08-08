const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const post = require(process.env.PWD + '/app/lib/post');
const pub = require('./fixtures/create-config');

test('Creates a note', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\bwatched-isle-of-dogs\b/g)
    .reply(200);

  // Setup
  const body = require('./fixtures/type-note');

  // Test assertions
  const response = await post.create(pub, body);
  t.truthy(validUrl.isUri(response));

  scope.done();
});

test('Creates a photo', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\bwatched-isle-of-dogs\b/g)
    .reply(200);

  // Setup
  const body = require('./fixtures/type-note');
  const photo = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const files = [{
    buffer: Buffer.from(photo),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  }];

  // Test assertions
  const response = await post.create(pub, body, files);
  t.truthy(validUrl.isUri(response));

  scope.done();
});

test('Throws error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\bwatched-isle-of-dogs\b/g)
    .reply(404, {
      message: 'Not found'
    });

  // Setup
  const body = require('./fixtures/type-note');

  // Test assertions
  const error = await t.throwsAsync(post.create(pub, body));
  t.is(error.message.error_description, 'Not found');

  scope.done();
});
