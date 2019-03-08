const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');
const request = require('supertest');

const app = request(require(process.env.PWD + '/app/server'));

test('700: Upload a GIF to the Media Endpoint', async t => {
  const scope = nock('https://api.github.com')
    .log(console.log)
    .put(/\b[\d\w]{5}\b/g)
    .delay(500)
    .reply(200, {
      type: 'file',
      encoding: 'base64',
      name: /\b[\d\w]{5}\b.gif/g,
      path: /\b[\d\w]{5}\b.gif/g,
      content: 'R0lGODlhAQABAIABAP8AAAAAACwAAAAAAQABAAACAkQBADs='
    });
  const gif = path.resolve(__dirname, 'fixtures/image.gif');
  const response = await app.post('/media')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`)
    .attach('file', gif);
  t.is(response.status, 201);
  scope.done();
});
