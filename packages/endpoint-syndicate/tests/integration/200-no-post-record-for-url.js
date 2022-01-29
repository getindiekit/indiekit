import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {testServer} from '@indiekit-test/server';

test('Returns 200 if no post record for URL', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create',
    });
  const request = await testServer();

  const result = await request.post('/syndicate')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`);

  t.is(result.statusCode, 200);
  t.is(result.body.success_description, `No post record available for ${process.env.TEST_PUBLICATION_URL}notes/foobar/`);
});
