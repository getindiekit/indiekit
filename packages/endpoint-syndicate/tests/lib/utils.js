import test from 'ava';
import {posts} from '../fixtures/posts.js';
import {
  getMicropubEndpoint,
  getPostData
} from '../../lib/utils.js';

test.beforeEach(t => {
  t.context.publication = {
    micropubEndpoint: '/micropub',
    posts
  };
});

test('Gets Micropub endpoint from server derived values', t => {
  const request = {
    protocol: 'https',
    headers: {
      host: 'server.example'
    }
  };
  const result = getMicropubEndpoint(t.context.publication, request);
  t.is(result, 'https://server.example/micropub');
});

test('Gets post for given URL from database', async t => {
  const url = 'https://website.example/post/12345';
  const result = await getPostData(t.context.publication, url);
  t.is(result.properties['mp-syndicate-to'], 'https://social.example/');
});

test('Gets post data from database', async t => {
  const result = await getPostData(t.context.publication);
  t.is(result.properties['mp-syndicate-to'], 'https://social.example/');
});
