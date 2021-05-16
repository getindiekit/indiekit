import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {JSDOM} from 'jsdom';
import {server} from '@indiekit-test/server';

test.before(async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'media'
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('.jpg'))
    .reply(200, {commit: {message: 'Message'}});

  // Upload file
  const request = await server;
  await request.post('/media')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .attach('file', getFixture('file-types/photo.jpg', false), 'photo.jpg');

  // Get file data by parsing list of files and getting values from link
  const response = await request.get('/media/files')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const dom = new JSDOM(response.text);
  const link = dom.window.document.querySelector('.file a');

  // Return test data
  t.context.filename = link.textContent;
  t.context.fileId = link.href.split('/').pop();
});

test('Views previously uploaded file', async t => {
  const request = await server;
  const response = await request.get(`/media/files/${t.context.fileId}`)
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector('title').textContent, `${t.context.filename} - Indiekit`);
});
