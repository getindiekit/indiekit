import test from 'ava';
import {server} from '@indiekit-test/server';

test('Auth callback returns 403 if redirect is invalid', async t => {
  const request = await server;

  const result = await request.get('/session/auth')
    .query('redirect=https://external.example');

  t.is(result.statusCode, 403);
});
