import test from 'ava';
import nock from 'nock';
import {JSDOM} from 'jsdom';
import {server} from '@indiekit-test/server';

test.before(async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create'
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar.md'))
    .reply(200);

  // Create post
  const request = await server;
  await request.post('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .send('h=entry')
    .send('name=Foobar');

  // Get post data by parsing list of posts and getting values from link
  const response = await request.get('/micropub/posts')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const dom = new JSDOM(response.text);
  const link = dom.window.document.querySelector('.file a');

  // Return test data
  t.context.postName = link.textContent;
  t.context.postId = link.href.split('/').pop();
});

test('Views previously uploaded file', async t => {
  const request = await server;
  const response = await request.get(`/micropub/posts/${t.context.postId}`)
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const dom = new JSDOM(response.text);

  const result = dom.window.document;

  t.is(result.querySelector('title').textContent, `${t.context.postName} - Indiekit`);
});
