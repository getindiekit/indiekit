import test from 'ava';
import {server} from '@indiekit-test/server';

test('Login returns 401 if URL is unauthorized', async t => {
  const request = await server;

  const result = await request.post('/session/login')
    .send('me=example.website');

  t.is(result.statusCode, 401);
});
