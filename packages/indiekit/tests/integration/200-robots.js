import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns robots.txt', async t => {
  const request = await testServer();

  const result = await request.get('/robots.txt');

  t.is(result.text, 'User-agent: *\nDisallow: /');
});
