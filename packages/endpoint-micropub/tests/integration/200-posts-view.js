import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {JSDOM} from 'jsdom';
import {server} from '@indiekit-test/server';

test('Views previously uploaded file', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create',
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar.md'))
    .reply(200);

  // Create post
  const request = await server();
  await request.post('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .send('h=entry')
    .send('name=Foobar');

  // Get post data by parsing list of posts and getting values from link
  const postsResponse = await request.get('/micropub/posts')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const postsDom = new JSDOM(postsResponse.text);
  const postLink = postsDom.window.document.querySelector('.file a');
  const postName = postLink.textContent;
  const postId = postLink.href.split('/').pop();

  // Visit post page
  const postResponse = await request.get(`/micropub/posts/${postId}`)
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});
  const postDom = new JSDOM(postResponse.text);

  const result = postDom.window.document;

  t.is(result.querySelector('title').textContent, `${postName} - Indiekit`);
});
