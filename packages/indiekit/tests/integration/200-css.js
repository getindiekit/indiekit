import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns CSS', async t => {
  const request = await server;

  const result = await request.get('/assets/app.css');

  t.is(result.statusCode, 200);
  t.is(result.type, 'text/css');
});
