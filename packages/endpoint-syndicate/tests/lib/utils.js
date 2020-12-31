import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
import {posts} from '../fixtures/posts.js';
import {
  getMicropubEndpoint,
  getPostData,
  jsonFeedtoJf2
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

test('Gets post data from JSON Feed', async t => {
  const scope = nock('https://website.example')
    .get('/feed.json')
    .reply(200, getFixture('feed.json'));
  const result = await getPostData({jsonFeed: 'https://website.example/feed.json'});
  t.is(result.properties.name, 'Second item');
  scope.done();
});

test('Gets post data from database', async t => {
  const result = await getPostData(t.context.publication);
  t.is(result.properties['mp-syndicate-to'], 'https://social.example/');
});

test('Converts JSON Feed to JF2', t => {
  const result = jsonFeedtoJf2(JSON.parse(getFixture('feed.json')));
  t.deepEqual(result, {
    type: 'feed',
    name: 'My Example Feed',
    summary: 'A description of my example feed',
    url: 'https://website.example/',
    photo: 'https://website.example/icon.png',
    author: {
      type: 'card',
      name: 'Jane Doe',
      url: 'https://website.example/~janedoe',
      photo: 'https://website.example/~janedoe/photo.jpg'
    },
    children: [{
      type: 'entry',
      uid: '2',
      url: 'https://website.example/second-item',
      name: 'Second item',
      content: {
        text: 'This second item has all fields.',
        html: '<p>This second item has <strong>all</strong> fields.</p>'
      },
      summary: 'This is the second item',
      featured: 'https://another.example/banner_image.jpg',
      published: '2020-12-31T17:05:55+00:00',
      updated: '2021-01-01T12:05:55+00:00',
      author: {
        type: 'card',
        name: 'Joe Bloggs',
        url: 'https://website.example/~joebloggs',
        photo: 'https://website.example/~joebloggs/photo.jpg'
      },
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
      }],
      'x-blue-shed': {
        explicit: false
      }
    }, {
      type: 'entry',
      uid: '1',
      content: {
        text: 'This first item has only the required fields.'
      }
    }],
    'x-blue-shed': {
      about: 'https://blueshed-podcasts.com/json-feed-extension-docs',
      copyright: '1948 by George Orwell',
      owner: 'Big Brother and the Holding Company',
      subtitle: 'All shouting, all the time. Double. Plus. Good.'
    }
  });
});
