import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Redirects unauthorized user to login page', async t => {
  const request = await testServer();

  const result = await request.get('/status');

  t.is(result.header.location, '/session/login?redirect=/status');
  t.is(result.statusCode, 302);
});
