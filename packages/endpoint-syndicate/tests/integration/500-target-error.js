import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';

test('Returns 500 error syndicating a URL', async t => {
  // Setup mocked failed HTTP request to syndication target
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create update'
    });
  nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .replyWithError('Not found');
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar'))
    .reply(200);

  // Create post
  const request = await server;
  await request.post('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .send('h=entry')
    .send('name=foobar')
    .send('mp-syndicate-to=https://twitter.com/user');

  // Syndicate post
  const result = await request.post('/syndicate')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`);

  // Assertions
  t.is(result.statusCode, 500);
  t.regex(result.body.error_description, /Not found/);
});
