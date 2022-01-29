import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {JSDOM} from 'jsdom';
import {testServer} from '@indiekit-test/server';

test('Returns list of previously uploaded files', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create',
    });
  const request = await testServer({useDatabase: false});
  const response = await request.get('/micropub/posts')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector('title').textContent, 'Internal Server Error - Test config');
  t.is(result.querySelector('.article__body p').textContent, 'This feature requires a database.');
});
