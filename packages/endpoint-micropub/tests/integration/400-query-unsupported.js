import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {testServer} from '@indiekit-test/server';

test('Returns 400 if unsupported parameter provided', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create',
    });
  const request = await testServer();

  const result = await request.get('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query('q=fooBar');

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, 'Unsupported parameter: fooBar');
});
