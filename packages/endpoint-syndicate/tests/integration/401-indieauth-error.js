import process from 'node:process';
import test from 'ava';
import mockSession from 'mock-session';
import nock from 'nock';
import {testServer} from '@indiekit-test/server';

test('Returns 401 error from Micropub endpoint', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .twice()
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create',
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar'))
    .reply(200);
  nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(200, {
      id_str: '1234567890987654321', // eslint-disable-line camelcase
      user: {screen_name: 'username'}, // eslint-disable-line camelcase
    });

  // Create post
  const request = await testServer();
  await request.post('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .send('h=entry')
    .send('name=foobar')
    .send('mp-syndicate-to=https://twitter.com/username');

  // Syndicate post
  const cookie = mockSession('test', 'secret', {
    token: process.env.TEST_BEARER_TOKEN,
  });
  const result = await request.post('/syndicate')
    .set('Accept', 'application/json')
    .set('Cookie', [cookie])
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`)
    .query(`token=${process.env.TEST_BEARER_TOKEN}`);

  // Assertions
  t.is(result.statusCode, 401);
  t.is(result.body.error_description, 'The scope of this token does not meet the requirements for this request');
});
