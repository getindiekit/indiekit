import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {testServer} from '@indiekit-test/server';

test('Returns categories', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create',
    });
  const request = await testServer();

  const response = await request.get('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query('q=config');

  t.truthy(response.body['media-endpoint']);
  t.truthy(response.body['post-types']);
  t.truthy(response.body['syndicate-to']);
  t.truthy(response.body.q);
});
