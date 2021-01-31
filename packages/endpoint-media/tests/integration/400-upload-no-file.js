import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {server} from '@indiekit-test/server';

test.serial('Returns 400 if no file included in request', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'media'
    });
  const request = await server;

  const result = await request.post('/media')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`);

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, 'No file included in request');
});
