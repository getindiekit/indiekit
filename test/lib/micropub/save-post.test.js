const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');

const utils = require(process.env.PWD + '/app/lib/utils');

// Function
const savePost = require(process.env.PWD + '/app/lib/micropub/save-post');
const pub = require('./fixtures/create-config');

// Tests
test('Creates a note', async t => {
  const body = require('./fixtures/type-note');
  nock('https://api.github.com').persist().put(/\bwatched-isle-of-dogs\b/g).reply(200);
  const response = await savePost(pub, body);
  t.truthy(utils.isValidUrl(response));
});

test('Creates a photo', async t => {
  const body = require('./fixtures/type-note');
  const photo = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const files = [{
    buffer: Buffer.from(photo),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  }];
  nock('https://api.github.com').persist().put(/\bwatched-isle-of-dogs\b/g).reply(200);
  const response = await savePost(pub, body, files);
  t.truthy(utils.isValidUrl(response));
});
