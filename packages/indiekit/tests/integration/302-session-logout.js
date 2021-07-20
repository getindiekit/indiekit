import test from 'ava';
import {server} from '@indiekit-test/server';

test('Logout redirects to homepage', async t => {
  const request = await server();

  const result = await request.get('/session/logout');

  t.is(result.header.location, '/');
  t.is(result.statusCode, 302);
});
