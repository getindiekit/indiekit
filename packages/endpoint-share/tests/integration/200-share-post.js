import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';

test('Posts content and redirects back to share page', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create'
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar.md'))
    .reply(200, {commit: {message: 'Message'}});

  // Publish post
  const request = await server;
  const result = await request.post('/share')
    .send(`access_token=${process.env.TEST_PUBLICATION_URL}`)
    .send('name=Foobar')
    .send('content=Test+of+sharing+a+bookmark')
    .send('bookmark-of=https://example.website');

  t.is(result.statusCode, 302);
});
