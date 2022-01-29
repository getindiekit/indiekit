import process from 'node:process';
import test from 'ava';
import mockSession from 'mock-session';
import nock from 'nock';
import {JSDOM} from 'jsdom';
import {testServer} from '@indiekit-test/server';

test('Returns list of previously uploaded files', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'media',
    });
  const request = await testServer();
  const cookie = mockSession('test', 'secret', {
    token: process.env.TEST_BEARER_TOKEN,
  });
  const response = await request.get('/media/files')
    .set('Cookie', [cookie]);
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector('title').textContent, 'Uploaded files - Test config');
});
