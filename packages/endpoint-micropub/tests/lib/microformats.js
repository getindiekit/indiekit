import test from 'ava';
import nock from 'nock';
import dateFns from 'date-fns';
import parser from 'microformats-parser';
import {getFixture} from '../helpers/fixture.js';
import {
  formEncodedToJf2,
  getJf2,
  getMf2Properties,
  getAudioProperty,
  getContentProperty,
  getPhotoProperty,
  getVideoProperty,
  getPublishedProperty,
  getSlugProperty,
  getSyndicateToProperty,
  jf2ToMf2,
  url2Mf2
} from '../../lib/microformats.js';

const {isValid, parseISO} = dateFns;

test.beforeEach(t => {
  t.context = {
    publication: {
      slugSeparator: '-',
      syndicationTargets: [{
        name: 'Example social network',
        uid: 'https://social.example/'
      }],
      timeZone: 'UTC'
    },
    nock: nock('https://website.example').get('/post.html'),
    url: 'https://website.example/post.html'
  };
});

test('Creates JF2 object from form-encoded request', t => {
  const result = formEncodedToJf2({
    h: 'entry',
    content: 'I+ate+a+cheese+sandwich,+which+was+nice.',
    category: ['foo', 'bar']
  });
  t.deepEqual(result, {
    type: 'entry',
    content: 'I ate a cheese sandwich, which was nice.',
    category: ['foo', 'bar']
  });
});

test('Gets JF2 object (few properties)', t => {
  const properties = JSON.parse(getFixture('content-provided.jf2'));
  const result = getJf2(t.context.publication, properties);
  t.is(result.type, 'entry');
  t.is(result.name, 'Lunchtime');
  t.is(result['mp-slug'], 'lunchtime');
  t.deepEqual(result.content, {
    html: '<p>I ate a <em>cheese</em> sandwich, which was nice.</p>',
    text: 'I ate a *cheese* sandwich, which was nice.'
  });
  t.falsy(result.audio);
  t.falsy(result.photo);
  t.falsy(result.video);
  t.true(isValid(parseISO(result.published)));
});

test('Gets JF2 object (all properties)', t => {
  const properties = JSON.parse(getFixture('entry.jf2'));
  const result = getJf2(t.context.publication, properties);
  t.is(result.type, 'entry');
  t.is(result.name, 'Lunchtime');
  t.deepEqual(result.content, {
    html: '<p>I ate a <em>cheese</em> sandwich, which was nice.</p>',
    text: 'I ate a *cheese* sandwich, which was nice.'
  });
  t.deepEqual(result.audio, [
    {url: 'http://foo.bar/baz.mp3'},
    {url: 'http://foo.bar/qux.mp3'}
  ]);
  t.deepEqual(result.photo, [
    {url: 'http://foo.bar/baz.jpg', alt: 'Baz'},
    {url: 'http://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
  t.deepEqual(result.video, [
    {url: 'http://foo.bar/baz.mp4'},
    {url: 'http://foo.bar/qux.mp4'}
  ]);
  t.deepEqual(result.category, ['lunch', 'food']);
  t.true(isValid(parseISO(result.published)));
  t.deepEqual(result['mp-syndicate-to'], ['https://social.example/']);
});

test('Returns mf2 item with all properties', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = getMf2Properties(mf2);
  t.deepEqual(result, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.'],
      published: ['2013-03-07'],
      content: ['I ate a cheese sandwich, which was nice.']
    }
  });
});

test('Returns mf2 item with multiple properties', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = getMf2Properties(mf2, ['name', 'published']);
  t.deepEqual(result, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.'],
      published: ['2013-03-07']
    }
  });
});

test('Returns mf2 item with single property', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = getMf2Properties(mf2, 'name');
  t.deepEqual(result, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.']
    }
  });
});

test('Returns mf2 item with empty object if property not found', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = getMf2Properties(mf2, 'location');
  t.deepEqual(result, {
    properties: {}
  });
});

test('Throws error if mf2 has no items', t => {
  const mf2 = parser.mf2(getFixture('page.html'), {baseUrl: t.context.url});
  const error = t.throws(() => getMf2Properties(mf2, 'name'));
  t.is(error.message, 'Source has no items');
});

test('Gets audio property', t => {
  const properties = JSON.parse(getFixture('audio-provided-value.jf2'));
  const result = getAudioProperty(properties, 'https://website.example/');
  t.deepEqual(result, [
    {url: '/baz.mp3'},
    {url: 'https://foo.bar/qux.mp3'}
  ]);
});

test('Gets normalised audio property', t => {
  const properties = JSON.parse(getFixture('audio-provided.jf2'));
  const result = getAudioProperty(properties, 'https://website.example/');
  t.deepEqual(result, [
    {url: '/baz.mp3'},
    {url: 'https://foo.bar/qux.mp3'}
  ]);
});

test('Gets existing text and HTML values from `content` property', t => {
  const properties = JSON.parse(getFixture('content-provided-html-value.jf2'));
  const result = getContentProperty(properties);
  t.deepEqual(result, {
    html: '<p>I ate a <i>cheese</i> sandwich, which was nice.</p>',
    text: 'I ate a *cheese* sandwich, which was nice.'
  });
});

test('Gets existing HTML from `content` property and adds text value', t => {
  const properties = JSON.parse(getFixture('content-provided-html.jf2'));
  const result = getContentProperty(properties);
  t.deepEqual(result, {
    html: '<p>I ate a <i>cheese</i> sandwich, which was nice.</p>',
    text: 'I ate a *cheese* sandwich, which was nice.'
  });
});

test('Gets content from `content.text` property', t => {
  const properties = JSON.parse(getFixture('content-provided-value.jf2'));
  const result = getContentProperty(properties);
  t.deepEqual(result, {
    html: '<p>I ate a <em>cheese</em> sandwich, which was nice.</p>',
    text: 'I ate a *cheese* sandwich, which was nice.'
  });
});

test('Gets content from `content` property', t => {
  const properties = JSON.parse(getFixture('content-provided.jf2'));
  const result = getContentProperty(properties);
  t.deepEqual(result, {
    html: '<p>I ate a <em>cheese</em> sandwich, which was nice.</p>',
    text: 'I ate a *cheese* sandwich, which was nice.'
  });
});

test('Gets photo property', t => {
  const properties = JSON.parse(getFixture('photo-provided.jf2'));
  const result = getPhotoProperty(properties, 'https://website.example/');
  t.deepEqual(result, [
    {url: '/baz.jpg'},
    {url: 'https://foo.bar/qux.jpg'}
  ]);
});

test('Gets normalised photo property', t => {
  const properties = JSON.parse(getFixture('photo-provided-value-alt.jf2'));
  const result = getPhotoProperty(properties, 'https://website.example/');
  t.deepEqual(result, [
    {url: '/baz.jpg', alt: 'Baz'},
    {url: 'https://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
});

test('Gets normalised photo property, adding provided text alternatives', t => {
  const properties = JSON.parse(getFixture('photo-provided-mp-photo-alt.jf2'));
  const result = getPhotoProperty(properties, 'https://website.example/');
  t.deepEqual(result, [
    {url: '/baz.jpg', alt: 'Baz'},
    {url: 'https://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
});

test('Gets video property', t => {
  const properties = JSON.parse(getFixture('video-provided-value.jf2'));
  const result = getVideoProperty(properties, 'https://website.example/');
  t.deepEqual(result, [
    {url: '/baz.mp4'},
    {url: 'https://foo.bar/qux.mp4'}
  ]);
});

test('Gets normalised video property', t => {
  const properties = JSON.parse(getFixture('video-provided.jf2'));
  const result = getVideoProperty(properties, 'https://website.example/');
  t.deepEqual(result, [
    {url: '/baz.mp4'},
    {url: 'https://foo.bar/qux.mp4'}
  ]);
});

test('Gets date from `published` property', t => {
  const properties = JSON.parse(getFixture('published-provided.jf2'));
  const result = getPublishedProperty(properties);
  t.is(result, '2019-01-02T03:04:05.678Z');
});

test('Gets date from `published` property (short date)', t => {
  const properties = JSON.parse(getFixture('published-provided-short.jf2'));
  const result = getPublishedProperty(properties);
  t.is(result, '2019-01-02T00:00:00.000Z');
});

test('Gets date by using current date', t => {
  const properties = JSON.parse(getFixture('published-missing.jf2'));
  const result = getPublishedProperty(properties);
  t.true(isValid(parseISO(result)));
});

test('Derives slug from `mp-slug` property', t => {
  const properties = JSON.parse(getFixture('slug-provided.jf2'));
  const slug = getSlugProperty(properties, '-');
  t.is(slug, 'cheese-sandwich');
});

test('Derives slug from unslugified `mp-slug` property', t => {
  const properties = JSON.parse(getFixture('slug-provided-unslugified.jf2'));
  const slug = getSlugProperty(properties, '-');
  t.is(slug, 'cheese-sandwich');
});

test('Derives slug, ignoring empty `mp-slug` property', t => {
  const properties = JSON.parse(getFixture('slug-provided-empty.jf2'));
  const slug = getSlugProperty(properties, '-');
  t.is(slug, 'i-ate-a-cheese-sandwich');
});

test('Derives slug from `name` property', t => {
  const properties = JSON.parse(getFixture('slug-missing.jf2'));
  const slug = getSlugProperty(properties, '-');
  t.is(slug, 'i-ate-a-cheese-sandwich');
});

test('Derives slug by generating random number', t => {
  const properties = JSON.parse(getFixture('slug-missing-no-name.jf2'));
  const slug = getSlugProperty(properties, '-');
  t.regex(slug, /[\d\w]{5}/g);
});

test('Does not add syndication target if no syndicators', t => {
  const properties = JSON.parse(getFixture('syndicate-to-provided.jf2'));
  const syndicationTargets = [];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.falsy(result);
});

test('Adds syndication target checked by client', t => {
  const properties = JSON.parse(getFixture('syndicate-to-provided.jf2'));
  const syndicationTargets = [{
    uid: 'https://example.website/'
  }];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.deepEqual(result, ['https://example.website/']);
});

test('Adds syndication target not checked by client but forced by server', t => {
  const properties = false;
  const syndicationTargets = [{
    uid: 'https://example.website/',
    options: {forced: true}
  }];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.deepEqual(result, ['https://example.website/']);
});

test('Adds syndication target checked by client and forced by server', t => {
  const properties = JSON.parse(getFixture('syndicate-to-provided.jf2'));
  const syndicationTargets = [{
    uid: 'https://example.website/',
    options: {forced: true}
  }];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.deepEqual(result, ['https://example.website/']);
});

test('Adds syndication targets, one checked by client, one forced by server', t => {
  const properties = JSON.parse(getFixture('syndicate-to-provided.jf2'));
  const syndicationTargets = [{
    uid: 'https://example.website/'
  }, {
    uid: 'https://another-example.website/',
    options: {forced: true}
  }];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.deepEqual(result, ['https://example.website/', 'https://another-example.website/']);
});

test('Doesn’t add unavilable syndication target', t => {
  const properties = false;
  const syndicationTargets = [{
    uid: 'https://example.website/'
  }];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.falsy(result);
});

test('Doesn’t add unchecked syndication target', t => {
  const properties = {properties: {
    'syndicate-to': 'https://another.example'}
  };
  const syndicationTargets = [{
    uid: 'https://example.website/'
  }];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.falsy(result);
});

test('Doesn’t add unavailable syndication target', t => {
  const properties = {properties: {
    'syndicate-to': 'https://another.example'}
  };
  const syndicationTargets = [];
  const result = getSyndicateToProperty(properties, syndicationTargets);
  t.falsy(result);
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

test('Returns mf2 from URL', async t => {
  const scope = t.context.nock.reply(200, getFixture('post.html'));
  const result = await url2Mf2(t.context.url);
  t.deepEqual(result, {
    rels: {},
    'rel-urls': {},
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['I ate a cheese sandwich, which was nice.'],
        published: ['2013-03-07'],
        content: ['I ate a cheese sandwich, which was nice.']
      }
    }]
  });
  scope.done();
});

test('Returns mf2 empty objects if no microformats found', async t => {
  const scope = t.context.nock.reply(200, getFixture('page.html'));
  const result = await url2Mf2(t.context.url);
  t.deepEqual(result, {
    rels: {},
    'rel-urls': {},
    items: []
  });
  scope.done();
});

test('Throws error if URL not found', async t => {
  const scope = t.context.nock.replyWithError('Not found');
  const error = await t.throwsAsync(url2Mf2(t.context.url));
  t.is(error.message, 'Not found');
  scope.done();
});
