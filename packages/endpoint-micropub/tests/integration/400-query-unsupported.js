import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 400 if unsupported parameter provided', async t => {
  const request = await server;

  const result = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=foobar');

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, 'Unsupported parameter: foobar');
});
