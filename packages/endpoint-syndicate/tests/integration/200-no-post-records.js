import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 200 if no post records', async t => {
  const request = await server;

  const result = await request.post('/syndicate')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json');

  t.is(result.statusCode, 200);
  t.is(result.body.success_description, 'No post records available');
});
