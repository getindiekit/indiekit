import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns robots.txt', async t => {
  const request = await server;

  const result = await request.get('/robots.txt');

  t.is(result.text, 'User-agent: *\nDisallow: /');
});
