/* eslint-disable camelcase */
import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
import {twitter} from '../../lib/twitter.js';

test.beforeEach(t => {
  t.context = {
    apiResponse: {
      id_str: '1234567890987654321',
      user: {screen_name: 'username'}
    },
    mediaUrl: 'https://website.example/image.jpg',
    tweetUrl: 'https://twitter.com/username/status/1234567890987654321',
    statusId: '1234567890987654321',
    options: {
      apiKey: '0123456789abcdefghijklmno',
      apiKeySecret: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0123456789',
      accessTokenKey: 'ABCDEFGHIJKLMNabcdefghijklmnopqrstuvwxyz0123456789',
      accessTokenSecret: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN',
      user: 'username'
    }
  };
});

test('Tests if string is a tweet permalink', t => {
  const twitterURL = twitter(t.context.options).isTweetUrl('https://twitter.com/paulrobertlloyd/status/1341502435760680961');
  const anotherURL = twitter(t.context.options).isTweetUrl('https://getindiekit.com');
  t.true(twitterURL);
  t.false(anotherURL);
});

test('Gets status ID from Twitter permalink', t => {
  const result = twitter(t.context.options).getStatusIdFromUrl('https://twitter.com/paulrobertlloyd/status/1341502435760680961');
  t.is(result, '1341502435760680961');
});

test('Posts a like', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/favorites/create.json')
    .reply(200, t.context.apiResponse);
  const result = await twitter(t.context.options).postLike(t.context.tweetUrl);
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});

test('Throws error posting a like', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/favorites/create.json')
    .replyWithError('Not found');
  const error = await t.throwsAsync(twitter(t.context.options).postLike(t.context.tweetUrl));
  t.regex(error.message, /Not found/);
  scope.done();
});

test('Throws API error posting a like', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/favorites/create.json')
    .reply(404, {
      errors: [{
        message: 'Not found'
      }]
    });
  const error = await t.throwsAsync(twitter(t.context.options).postLike(t.context.tweetUrl));
  t.regex(error.message, /Not found/);
  scope.done();
});

test('Posts a retweet', async t => {
  const scope = nock('https://api.twitter.com')
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .reply(200, t.context.apiResponse);
  const result = await twitter(t.context.options).postRetweet(t.context.tweetUrl);
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});

test('Throws error posting a retweet', async t => {
  const scope = nock('https://api.twitter.com')
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .replyWithError('Not found');
  const error = await t.throwsAsync(twitter(t.context.options).postRetweet(t.context.tweetUrl));
  t.regex(error.message, /Not found/);
  scope.done();
});

test('Throws API error posting a retweet', async t => {
  const scope = nock('https://api.twitter.com')
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .reply(404, {
      errors: [{
        message: 'Not found'
      }]
    });
  const error = await t.throwsAsync(twitter(t.context.options).postRetweet(t.context.tweetUrl));
  t.regex(error.message, /Not found/);
  scope.done();
});

test('Posts a status', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(200, t.context.apiResponse);
  const result = await twitter(t.context.options).postStatus(t.context.status);
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});

test('Throws error posting a status', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .replyWithError('Not found');
  const error = await t.throwsAsync(twitter(t.context.options).postStatus(t.context.status));
  t.regex(error.message, /Not found/);
  scope.done();
});

test('Throws API error posting a status', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(404, {
      errors: [{
        message: 'Not found'
      }]
    });
  const error = await t.throwsAsync(twitter(t.context.options).postStatus(t.context.status));
  t.regex(error.message, /Not found/);
  scope.done();
});

test('Throws error fetching media to upload', async t => {
  const scope = nock('https://website.example')
    .get('/image.jpg')
    .replyWithError('Not found');
  const error = await t.throwsAsync(twitter(t.context.options).uploadMedia(t.context.mediaUrl));
  t.regex(error.message, /Not found/);
  scope.done();
});

test('Uploads media and returns a media id', async t => {
  const sourceScope = nock('https://website.example')
    .get('/image.jpg')
    .reply(200, {body: getFixture('photo.jpg', false)});
  const uploadScope = nock('https://upload.twitter.com')
    .post('/1.1/media/upload.json')
    .reply(200, {
      media_id_string: '1234567890987654321'
    });
  const result = await twitter(t.context.options).uploadMedia(t.context.mediaUrl);
  t.is(result, '1234567890987654321');
  sourceScope.done();
  uploadScope.done();
});

test('Throws error uploading media', async t => {
  const sourceScope = nock('https://website.example')
    .get('/image.jpg')
    .reply(200, {body: getFixture('photo.jpg', false)});
  const uploadScope = nock('https://upload.twitter.com')
    .post('/1.1/media/upload.json')
    .reply(404, {
      errors: [{
        message: 'Not found'
      }]
    });
  const error = await t.throwsAsync(twitter(t.context.options).uploadMedia(t.context.mediaUrl));
  t.regex(error.message, /Not found/);
  sourceScope.done();
  uploadScope.done();
});

test('Returns false passing an object to media upload function', async t => {
  const result = await twitter(t.context.options).uploadMedia({foo: 'bar'});
  t.falsy(result);
});

test('Creates a status with article post name and URL', async t => {
  const result = await twitter(t.context.options).createStatus({
    name: 'Lunchtime',
    content: 'I ate a cheese sandwich, which was nice.',
    url: 'https://foo.bar/lunchtime',
    'post-type': 'article'
  });
  t.is(result.status, 'Lunchtime\n\nhttps://foo.bar/lunchtime');
});

test('Creates a status with post name', async t => {
  const result = await twitter(t.context.options).createStatus({
    name: 'I ate a cheese sandwich, which was nice.',
    url: 'https://foo.bar/lunchtime'
  });
  t.is(result.status, 'I ate a cheese sandwich, which was nice.');
});

test('Creates a status with post text content', async t => {
  const result = await twitter(t.context.options).createStatus({
    content: {
      html: '<p>I ate a cheese sandwich, which was <em>nice</em>.</p>',
      text: 'I ate a cheese sandwich, which was nice.'
    },
    url: 'https://foo.bar/lunchtime'
  });
  t.is(result.status, 'I ate a cheese sandwich, which was nice.');
});

test('Creates a status with post content', async t => {
  const result = await twitter(t.context.options).createStatus({
    content: 'I ate a cheese sandwich, which was nice.',
    url: 'https://foo.bar/lunchtime'
  });
  t.is(result.status, 'I ate a cheese sandwich, which was nice.');
});

test('Creates a quote tweet with status URL and post content', async t => {
  const result = await twitter(t.context.options).createStatus({
    content: 'Someone else who likes cheese sandwiches.',
    'repost-of': t.context.tweetUrl,
    'post-type': 'repost'
  });
  t.is(result.status, `Someone else who likes cheese sandwiches.\n\n${t.context.tweetUrl}`);
});

test('Adds link to status post is in reply to', async t => {
  const result = await twitter(t.context.options).createStatus({
    content: 'I ate a cheese sandwich too!',
    'in-reply-to': t.context.tweetUrl
  });
  t.is(result.status, 'I ate a cheese sandwich too!');
  t.is(result.in_reply_to_status_id, '1234567890987654321');
});

test('Creates a status with a location', async t => {
  const result = await twitter(t.context.options).createStatus({
    content: 'I ate a cheese sandwich right here!',
    location: {
      properties: {
        latitude: '37.780080',
        longitude: '-122.420160'
      }
    }
  });
  t.is(result.status, 'I ate a cheese sandwich right here!');
  t.is(result.lat, '37.780080');
  t.is(result.long, '-122.420160');
});

test('Creates a status with a photo', async t => {
  const sourceScope = nock('https://website.example')
    .get('/image.jpg')
    .reply(200, {body: getFixture('photo.jpg', false)});
  const uploadScope = nock('https://upload.twitter.com')
    .post('/1.1/media/upload.json')
    .reply(200, {
      media_id_string: '1234567890987654321'
    });
  const result = await twitter(t.context.options).createStatus({
    content: 'Here’s the cheese sandwich I ate.',
    photo: [{
      url: t.context.mediaUrl
    }]
  });
  t.is(result.status, 'Here’s the cheese sandwich I ate.');
  t.is(result.media_ids, '1234567890987654321');
  sourceScope.done();
  uploadScope.done();
});

test('Creates a status with 4 out of 5 photos', async t => {
  const sourceScope1 = nock('https://website.example')
    .get('/image1.jpg').reply(200, {body: getFixture('photo.jpg', false)});
  const sourceScope2 = nock('https://website.example')
    .get('/image2.jpg').reply(200, {body: getFixture('photo.jpg', false)});
  const sourceScope3 = nock('https://website.example')
    .get('/image3.jpg').reply(200, {body: getFixture('photo.jpg', false)});
  const sourceScope4 = nock('https://website.example')
    .get('/image4.jpg').reply(200, {body: getFixture('photo.jpg', false)});
  const uploadScope1 = nock('https://upload.twitter.com')
    .post('/1.1/media/upload.json').reply(200, {media_id_string: '1'});
  const uploadScope2 = nock('https://upload.twitter.com')
    .post('/1.1/media/upload.json').reply(200, {media_id_string: '2'});
  const uploadScope3 = nock('https://upload.twitter.com')
    .post('/1.1/media/upload.json').reply(200, {media_id_string: '3'});
  const uploadScope4 = nock('https://upload.twitter.com')
    .post('/1.1/media/upload.json').reply(200, {media_id_string: '4'});
  const result = await twitter(t.context.options).createStatus({
    content: 'Here’s the cheese sandwiches I ate.',
    photo: [
      {url: 'https://website.example/image1.jpg'},
      {url: 'https://website.example/image2.jpg'},
      {url: 'https://website.example/image3.jpg'},
      {url: 'https://website.example/image4.jpg'},
      {url: 'https://website.example/image5.jpg'}
    ]
  });
  t.is(result.status, 'Here’s the cheese sandwiches I ate.');
  t.is(result.media_ids, '1,2,3,4');
  sourceScope1.done();
  sourceScope2.done();
  sourceScope3.done();
  sourceScope4.done();
  uploadScope1.done();
  uploadScope2.done();
  uploadScope3.done();
  uploadScope4.done();
});

test('Posts a like of a tweet to Twitter', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/favorites/create.json')
    .reply(200, t.context.apiResponse);
  const result = await twitter(t.context.options).post({
    'like-of': t.context.tweetUrl
  });
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});

test('Doesn’t post a like of a URL to Twitter', async t => {
  const result = await twitter(t.context.options).post({
    'like-of': 'https://foo.bar/lunchtime'
  });
  t.falsy(result);
});

test('Posts a repost of a tweet to Twitter', async t => {
  const scope = nock('https://api.twitter.com')
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .reply(200, t.context.apiResponse);
  const result = await twitter(t.context.options).post({
    'repost-of': t.context.tweetUrl
  });
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});

test('Doesn’t post a repost of a URL to Twitter', async t => {
  const result = await twitter(t.context.options).post({
    'repost-of': 'https://foo.bar/lunchtime'
  });
  t.falsy(result);
});

test('Posts a quote status to Twitter', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(200, t.context.apiResponse);
  const result = await twitter(t.context.options).post({
    content: 'Someone else who likes cheese sandwiches.',
    'repost-of': t.context.tweetUrl,
    'post-type': 'repost'
  });
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});

test('Posts a status to Twitter', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(200, t.context.apiResponse);
  const result = await twitter(t.context.options).post({
    content: 'I ate a cheese sandwich, which was nice.',
    url: 'https://foo.bar/lunchtime'
  });
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});
