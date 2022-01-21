import process from 'node:process';
import test from 'ava';
import {JSDOM} from 'jsdom';
import {testServer} from '@indiekit-test/server';

test('Returns 422 with invalid form submission', async t => {
  const request = await testServer();
  const response = await request.post('/share')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector('title').textContent, 'Error: Share - Test config');
  t.is(result.querySelector('#name-error .error-message__text').textContent, 'Enter a title');
  t.is(result.querySelector('#bookmark-of-error .error-message__text').textContent, 'Invalid value');
});
