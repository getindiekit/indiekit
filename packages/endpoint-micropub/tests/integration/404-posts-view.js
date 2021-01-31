import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 404 if can’t find previously published post', async t => {
  const request = await server;

  const result = await request.get('/micropub/posts/5ffcc8025c561a7bf53bd6e8')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});

  t.is(result.statusCode, 404);
  t.true(result.text.includes('No post was found with this UUID'));
});
