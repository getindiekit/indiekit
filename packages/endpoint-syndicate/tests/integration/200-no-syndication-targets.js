import test from 'ava';
import nock from 'nock';
import {indiekitConfig} from '@indiekit-test/config';
import {server} from '@indiekit-test/server';

test('Returns 200 if no post records', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .twice()
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create update'
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar'))
    .twice()
    .reply(200);
  const request = await server();

  // Update configuration
  const config = await indiekitConfig();
  config.publication.syndicationTargets = [];

  // Create post
  await request.post('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .send('h=entry')
    .send('name=foobar')
    .send('mp-syndicate-to=https://twitter.com/user');

  const result = await request.post('/syndicate')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json');

  t.is(result.statusCode, 200);
  t.is(result.body.success_description, 'No syndication targets have been configured');
});
