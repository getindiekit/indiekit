const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const media = require(process.env.PWD + '/app/lib/media');
const pub = require('./fixtures/create-config');

test('Saves a file to GitHub', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .reply(200);

  // Setup
  const image = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const file = {
    buffer: Buffer.from(image),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  };

  // Test assertions
  const response = await media.create(pub, file);
  t.truthy(validUrl.isUri(response));

  scope.done();
});

test('Throws error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .reply(404, {
      message: 'Not found'
    });

  // Setup
  const image = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const file = {
    buffer: Buffer.from(image),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  };

  // Test assertions
  const error = await t.throwsAsync(media.create(pub, file));
  t.is(error.message.error_description, 'Not found');

  scope.done();
});
