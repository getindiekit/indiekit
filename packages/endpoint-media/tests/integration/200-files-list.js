import process from 'node:process';
import test from 'ava';
import {JSDOM} from 'jsdom';
import {testServer} from '@indiekit-test/server';

test('Returns list of previously uploaded files', async t => {
  const request = await testServer();
  const response = await request.get('/media/files')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector('title').textContent, 'Uploaded files - Test config');
});
