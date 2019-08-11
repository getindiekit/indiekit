const path = require('path');
const fs = require('fs-extra');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const config = require(process.env.PWD + '/app/config');
const media = require(process.env.PWD + '/app/lib/media');
const pub = require('./fixtures/create-config');

const outputDir = process.env.PWD + '/.ava_output/media';

test.before(() => {
  config.data.dir = outputDir;
});

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
  const response = await media.create(pub, file);

  // Test assertions
  t.truthy(validUrl.isUri(response));
  scope.done();
});

test('Throws error if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/\b[\d\w]{5}\b/g)
    .replyWithError('Not found');

  // Setup
  const image = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const file = {
    buffer: Buffer.from(image),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  };
  const error = await t.throwsAsync(media.create(pub, file));

  // Test assertions
  t.regex(error.message.error_description, /\bNot found\b/);
  scope.done();
});

test('Throws error if no file specified', async t => {
  const error = await t.throwsAsync(media.create(pub, null));
  t.is(error.message.error_description, 'No file included in request');
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
