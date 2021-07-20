import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 400 if unsupported query provided', async t => {
  const request = await server();

  const result = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('foo=bar');

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, 'Invalid query');
});
