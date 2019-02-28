const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');

// Function
const createMedia = require(process.env.PWD + '/app/lib/micropub/create-media');
const publication = require('./fixtures/create-config');

// Tests
test('Uploads a photo via media endpoint', async t => {
  const photo1 = fs.readFileSync(path.resolve(__dirname, 'fixtures/photo1.gif'));
  const files = [{
    buffer: Buffer.from(photo1),
    originalname: 'photo1.gif'
  }];
  nock('https://api.github.com').persist().put(/\bwatched-isle-of-dogs\b/g).reply(200);
  const response = await createMedia(publication, files);
  t.is(response.code, 202);
});
