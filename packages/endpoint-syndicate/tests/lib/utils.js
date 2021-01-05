import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
import {posts} from '../fixtures/posts.js';
import {
  getMicropubEndpoint,
  getPostData,
  jf2ToMf2
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

test('Gets post data from JF2 Feed', async t => {
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

test('Gets post data stored in database, not JF2 Feed', async t => {
  const scope = nock('https://website.example')
    .get('/feed.jf2')
    .reply(200, getFixture('feed.jf2'));
  const {publication} = t.context;
  publication.jf2Feed = 'https://website.example/feed.jf2';
  const result = await getPostData(publication);
  t.is(result.properties.name, 'Item in database');
  t.not(result.properties.name, 'Second item in feed');
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

test('Converts JF2 to Microformats2 object', async t => {
  const feed = JSON.parse(getFixture('feed.jf2'));
  const result = await jf2ToMf2(feed.children[0]);
  t.deepEqual(result, {
    type: ['h-entry'],
    properties: {
      uid: ['https://website.example/second-item'],
      url: ['https://website.example/second-item'],
      name: ['Second item in feed'],
      content: [{
        value: 'This second item has all fields.',
        html: '<p>This second item has <strong>all</strong> fields.</p>'
      }],
      summary: ['This is the second item'],
      featured: ['https://another.example/banner_image.jpg'],
      published: ['2020-12-31T17:05:55+00:00'],
      updated: ['2021-01-01T12:05:55+00:00'],
      author: [{
        name: 'Joe Bloggs',
        url: 'https://website.example/~joebloggs',
        photo: 'https://website.example/~joebloggs/photo.jpg'
      }],
      category: ['second', 'example'],
      audio: [{
        url: 'https://website.example/second-item/audio.weba',
        alt: 'Audio',
        'content-type': 'audio/webm'
      }],
      photo: [{
        url: 'https://website.example/second-item/photo.webp',
        alt: 'Photo',
        'content-type': 'image/webp'
      }],
      video: [{
        url: 'https://website.example/second-item/audio.webm',
        alt: 'Video',
        'content-type': 'video/webm'
      }]
    }
  });
});
