import process from 'node:process';
import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns 200 if no post record for URL', async t => {
  const request = await testServer();

  const result = await request.post('/syndicate')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`);

  t.is(result.statusCode, 200);
  t.is(result.body.success_description, `No post record available for ${process.env.TEST_PUBLICATION_URL}notes/foobar/`);
});
