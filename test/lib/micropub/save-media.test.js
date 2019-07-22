const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');

const utils = require(process.env.PWD + '/app/lib/utils');

// Function
const saveMedia = require(process.env.PWD + '/app/lib/micropub/save-media');

// Tests
test('Saves a file to GitHub', async t => {
  const image = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const file = {
    buffer: Buffer.from(image),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  };
  nock('https://api.github.com').persist().put(/\b[\d\w]{5}\b/g).reply(200);
  const response = await saveMedia(file);
  t.truthy(utils.isValidUrl(response));
});
