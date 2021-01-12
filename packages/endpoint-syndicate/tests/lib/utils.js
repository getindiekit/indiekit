import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
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

test('Adds post data from JF2 Feed', async t => {
  const scope = nock('https://website.example')
    .get('/feed.jf2')
    .reply(200, getFixture('feed.jf2'));
  const publication = {
    jf2Feed: 'https://website.example/feed.jf2',
    posts: {
      findOne: async () => false,
      insertOne: async () => {}
    }
  };
  const result = await getPostData(publication);
  t.is(result.properties.name, 'Second item in feed');
  scope.done();
});

test('Updates post data from JF2 Feed to database', async t => {
  const scope = nock('https://website.example')
    .get('/feed.jf2')
    .reply(200, getFixture('feed.jf2'));
  const {publication} = t.context;
  publication.jf2Feed = 'https://website.example/feed.jf2';
  const result = await getPostData(publication);
  t.is(result.properties.name, 'Second item in feed');
  scope.done();
});

test('Throws error if no posts in JF2 Feed', async t => {
  const scope = nock('https://website.example')
    .get('/feed.jf2')
    .reply(200, getFixture('feed-empty.jf2'));
  const publication = {
    jf2Feed: 'https://website.example/feed.jf2',
    posts: {
      findOne: async () => false,
      insertOne: async () => {}
    }
  };
  const error = await t.throwsAsync(getPostData(publication));
  t.is(error.message, 'JF2 Feed does not contain any posts');
  scope.done();
});

test('Gets post data from database', async t => {
  const result = await getPostData(t.context.publication);
  t.is(result.properties['mp-syndicate-to'], 'https://social.example/');
});
