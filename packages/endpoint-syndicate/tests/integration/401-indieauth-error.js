import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';

test('Returns 401 error from Micropub endpoint', async t => {
  // Setup mocked HTTP requests
  nock('https://tokens.indieauth.com')
    .get('/token')
    .twice()
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create'
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar'))
    .reply(200);
  nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(200, {
      id_str: '1234567890987654321', // eslint-disable-line camelcase
      user: {screen_name: 'username'} // eslint-disable-line camelcase
    });

  const request = await server;
  await request.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`)
    .send('h=entry')
    .send('name=foobar');

  const result = await request.post('/syndicate')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`);
  t.is(result.statusCode, 401);
  t.is(result.body.error_description, 'The scope of this token does not meet the requirements for this request');
});
