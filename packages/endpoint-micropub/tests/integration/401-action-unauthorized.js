import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';

test('Returns 400 if access token does not provide adequate scope', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'media'
    });
  const request = await server;

  const result = await request.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN_NOSCOPE}`);

  t.is(result.statusCode, 401);
  t.is(result.body.error_description, 'The scope of this token does not meet the requirements for this request');
  t.is(result.body.scope, 'create');
});
