const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const post = require(process.env.PWD + '/app/lib/post');
const pub = require('./fixtures/create-config');

test('Creates a note', async t => {
  const body = require('./fixtures/type-note');
  nock('https://api.github.com').persist().put(/\bwatched-isle-of-dogs\b/g).reply(200);
  const response = await post.create(pub, body);
  t.truthy(validUrl.isUri(response));
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
  const response = await post.create(pub, body, files);
  t.truthy(validUrl.isUri(response));
});
