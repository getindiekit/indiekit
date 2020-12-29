import test from 'ava';
import {
  createStatus,
  getStatusIdFromUrl,
  htmlToStatus,
  isTweetUrl
} from '../../lib/utils.js';

test('Creates a status with post name', t => {
  const result = createStatus({
    name: 'I ate a cheese sandwich, which was nice.',
    url: 'https://foo.bar/lunchtime'
  });
  t.is(result.status, 'I ate a cheese sandwich, which was nice.');
});

test('Creates a status with article post name and URL', t => {
  const result = createStatus({
    name: 'Lunchtime',
    content: 'I ate a cheese sandwich, which was nice.',
    url: 'https://foo.bar/lunchtime',
    'post-type': 'article'
  });
  t.is(result.status, 'Lunchtime\n\nhttps://foo.bar/lunchtime');
});

test('Creates a status with post text content', t => {
  const result = createStatus({
    content: {
      html: '<p>I ate a <em>cheese</em> sandwich, which was nice.</p>',
      text: 'I ate a *cheese* sandwich, which was nice.'
    },
    url: 'https://foo.bar/lunchtime'
  });
  t.is(result.status, 'I ate a cheese sandwich, which was nice.');
});

test('Creates a status with post content', t => {
  const result = createStatus({
    content: 'I ate a cheese sandwich, which was nice.',
    url: 'https://foo.bar/lunchtime'
  });
  t.is(result.status, 'I ate a cheese sandwich, which was nice.');
});

test('Creates a quote tweet with status URL and post content', t => {
  const result = createStatus({
    content: 'Someone else who likes cheese sandwiches.',
    'repost-of': t.context.tweetUrl,
    'post-type': 'repost'
  });
  t.is(result.status, `Someone else who likes cheese sandwiches.\n\n${t.context.tweetUrl}`);
});

test('Adds link to status post is in reply to', t => {
  const result = createStatus({
    content: 'I ate a cheese sandwich too!',
    'in-reply-to': 'https://twitter.com/username/status/1234567890987654321'
  });
  t.is(result.status, 'I ate a cheese sandwich too!');
  t.is(result.in_reply_to_status_id, '1234567890987654321');
});

test('Creates a status with a location', t => {
  const result = createStatus({
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

test('Creates a status with a photo', t => {
  const result = createStatus({
    content: 'Here’s the cheese sandwich I ate.'
  }, ['1', '2', '3', '4']);
  t.is(result.status, 'Here’s the cheese sandwich I ate.');
  t.is(result.media_ids, '1,2,3,4');
});

test('Tests if string is a tweet permalink', t => {
  const twitterURL = isTweetUrl('https://twitter.com/paulrobertlloyd/status/1341502435760680961');
  const anotherURL = isTweetUrl('https://getindiekit.com');
  t.true(twitterURL);
  t.false(anotherURL);
});

test('Gets status ID from Twitter permalink', t => {
  const result = getStatusIdFromUrl('https://twitter.com/paulrobertlloyd/status/1341502435760680961');
  t.is(result, '1341502435760680961');
});

test('Convert HTML to status text', t => {
  const result = htmlToStatus('<p>I ate a <em>cheese</em> sandwich, which was nice.</p>');
  t.is(result, 'I ate a cheese sandwich, which was nice.');
});

test('Convert HTML to status text, appending last link href if present', t => {
  const result = htmlToStatus('<p>Hello <a href="/hello">world</a>, hello <a href="https://moon.example">moon</a>.</p>');
  t.is(result, 'Hello world, hello moon.\n\nhttps://moon.example');
});
