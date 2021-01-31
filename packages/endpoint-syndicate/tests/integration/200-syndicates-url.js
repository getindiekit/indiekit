import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';

test('Syndicates a URL', async t => {
  // Setup mocked HTTP requests
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
  nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(200, {
      id_str: '1234567890987654321', // eslint-disable-line camelcase
      user: {screen_name: 'username'} // eslint-disable-line camelcase
    });

  // Create post to syndicate
  const request = await server;
  await request.post('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .send('h=entry')
    .send('name=foobar');

  // Syndicate post
  const result = await request.post('/syndicate')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`);

  // Assertions
  t.is(result.statusCode, 200);
  t.is(result.body.success_description, `Post updated at ${process.env.TEST_PUBLICATION_URL}notes/foobar/`);
});
