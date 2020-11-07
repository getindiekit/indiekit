import test from 'ava';
import nock from 'nock';
import dateFns from 'date-fns';
import parser from 'microformats-parser';
import {getFixture} from '../helpers/fixture.js';
import {
  formEncodedToMf2,
  getMf2,
  getAudioProperty,
  getContentProperty,
  getPhotoProperty,
  getVideoProperty,
  getPublishedProperty,
  getSlugProperty,
  getSyndicateToProperty,
  mf2Properties,
  url2Mf2
} from '../../lib/microformats.js';

const {isValid, parseISO} = dateFns;

test.beforeEach(t => {
  t.context = {
    publication: {
      slugSeparator: '-',
      timeZone: 'UTC'
    },
    nock: nock('https://website.example').get('/post.html'),
    url: 'https://website.example/post.html'
  };
});

test('Creates Microformats2 object from form-encoded request', t => {
  const result = formEncodedToMf2({
    h: 'entry',
    content: 'I+ate+a+cheese+sandwich,+which+was+nice.',
    category: ['foo', 'bar']
  });
  t.deepEqual(result, {
    type: ['h-entry'],
    properties: {
      content: ['I ate a cheese sandwich, which was nice.'],
      category: ['foo', 'bar']
    }
  });
});

test('Gets Microformats2 object (few properties)', t => {
  const mf2 = JSON.parse(getFixture('content-provided.json'));
  const result = getMf2(t.context.publication, mf2);
  t.is(result.type[0], 'h-entry');
  t.is(result.properties.name[0], 'Lunchtime');
  t.is(result.properties.slug[0], 'lunchtime');
  t.is(result.properties.content[0], 'I ate a cheese sandwich, which was nice.');
  t.falsy(result.properties.audio);
  t.falsy(result.properties.photo);
  t.falsy(result.properties.video);
  t.true(isValid(parseISO(result.properties.published[0])));
});

test('Gets Microformats2 object (all properties)', t => {
  const mf2 = JSON.parse(getFixture('mf2.json'));
  const result = getMf2(t.context.publication, mf2);
  t.is(result.type[0], 'h-entry');
  t.is(result.properties.name[0], 'Lunchtime');
  t.is(result.properties.content[0], 'I ate a cheese sandwich, which was nice.');
  t.deepEqual(result.properties.audio, [
    {url: 'http://foo.bar/baz.mp3'},
    {url: 'http://foo.bar/qux.mp3'}
  ]);
  t.deepEqual(result.properties.photo, [
    {url: 'http://foo.bar/baz.jpg', alt: 'Baz'},
    {url: 'http://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
  t.deepEqual(result.properties.video, [
    {url: 'http://foo.bar/baz.mp4'},
    {url: 'http://foo.bar/qux.mp4'}
  ]);
  t.deepEqual(result.properties.category, ['lunch', 'food']);
  t.true(isValid(parseISO(result.properties.published[0])));
});

test('Gets audio property', t => {
  const mf2 = JSON.parse(getFixture('audio-provided-value.json'));
  const result = getAudioProperty(mf2);
  t.deepEqual(result, [
    {url: 'https://foo.bar/baz.mp3'},
    {url: 'https://foo.bar/qux.mp3'}
  ]);
});

test('Gets normalised audio property', t => {
  const mf2 = JSON.parse(getFixture('audio-provided.json'));
  const result = getAudioProperty(mf2);
  t.deepEqual(result, [
    {url: 'https://foo.bar/baz.mp3'},
    {url: 'https://foo.bar/qux.mp3'}
  ]);
});

test('Gets content from `content[0].html` property', t => {
  const mf2 = JSON.parse(getFixture('content-provided-html-value.json'));
  const result = getContentProperty(mf2);
  t.is(result[0], '<p>I ate a <i>cheese</i> sandwich, which was nice.</p>');
});

test('Gets content from `content[0].html` property (ignores `content.value`)', t => {
  const mf2 = JSON.parse(getFixture('content-provided-html.json'));
  const result = getContentProperty(mf2);
  t.is(result[0], '<p>I ate a <i>cheese</i> sandwich, which was nice.</p>');
});

test('Gets content from `content[0].value` property', t => {
  const mf2 = JSON.parse(getFixture('content-provided-value.json'));
  const result = getContentProperty(mf2);
  t.is(result[0], 'I ate a cheese sandwich, which was nice.');
});

test('Gets content from `content[0]` property', t => {
  const mf2 = JSON.parse(getFixture('content-provided.json'));
  const result = getContentProperty(mf2);
  t.is(result[0], 'I ate a cheese sandwich, which was nice.');
});

test('Gets photo property', t => {
  const mf2 = JSON.parse(getFixture('photo-provided.json'));
  const result = getPhotoProperty(mf2);
  t.deepEqual(result, [
    {url: 'https://foo.bar/baz.jpg'},
    {url: 'https://foo.bar/qux.jpg'}
  ]);
});

test('Gets normalised photo property', t => {
  const mf2 = JSON.parse(getFixture('photo-provided-value-alt.json'));
  const result = getPhotoProperty(mf2);
  t.deepEqual(result, [
    {url: 'https://foo.bar/baz.jpg', alt: 'Baz'},
    {url: 'https://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
});

test('Gets normalised photo property, adding provided text alternatives', t => {
  const mf2 = JSON.parse(getFixture('photo-provided-mp-photo-alt.json'));
  const result = getPhotoProperty(mf2);
  t.deepEqual(result, [
    {url: 'https://foo.bar/baz.jpg', alt: 'Baz'},
    {url: 'https://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
});

test('Gets video property', t => {
  const mf2 = JSON.parse(getFixture('video-provided-value.json'));
  const result = getVideoProperty(mf2);
  t.deepEqual(result, [
    {url: 'https://foo.bar/baz.mp4'},
    {url: 'https://foo.bar/qux.mp4'}
  ]);
});

test('Gets normalised video property', t => {
  const mf2 = JSON.parse(getFixture('video-provided.json'));
  const result = getVideoProperty(mf2);
  t.deepEqual(result, [
    {url: 'https://foo.bar/baz.mp4'},
    {url: 'https://foo.bar/qux.mp4'}
  ]);
});

test('Gets date from `published` property', t => {
  const mf2 = JSON.parse(getFixture('published-provided.json'));
  const result = getPublishedProperty(mf2);
  t.is(result[0], '2019-01-02T03:04:05.678Z');
});

test('Gets date from `published` property (short date)', t => {
  const mf2 = JSON.parse(getFixture('published-provided-short.json'));
  const result = getPublishedProperty(mf2);
  t.is(result[0], '2019-01-02T00:00:00.000Z');
});

test('Gets date by using current date', t => {
  const mf2 = JSON.parse(getFixture('published-missing.json'));
  const result = getPublishedProperty(mf2);
  t.true(isValid(parseISO(result[0])));
});

test('Derives slug from `mp-slug` property', t => {
  const mf2 = JSON.parse(getFixture('slug-provided.json'));
  const slug = getSlugProperty(mf2, '-');
  t.is(slug[0], 'cheese-sandwich');
});

test('Derives slug from unslugified `mp-slug` property', t => {
  const mf2 = JSON.parse(getFixture('slug-provided-unslugified.json'));
  const slug = getSlugProperty(mf2, '-');
  t.is(slug[0], 'cheese-sandwich');
});

test('Derives slug, ignoring empty `mp-slug` property', t => {
  const mf2 = JSON.parse(getFixture('slug-provided-empty.json'));
  const slug = getSlugProperty(mf2, '-');
  t.is(slug[0], 'i-ate-a-cheese-sandwich');
});

test('Derives slug from `name` property', t => {
  const mf2 = JSON.parse(getFixture('slug-missing.json'));
  const slug = getSlugProperty(mf2, '-');
  t.is(slug[0], 'i-ate-a-cheese-sandwich');
});

test('Derives slug by generating random number', t => {
  const mf2 = JSON.parse(getFixture('slug-missing-no-name.json'));
  const slug = getSlugProperty(mf2, '-');
  t.regex(slug[0], /[\d\w]{5}/g);
});

test('Does not add syndication target if no syndicators', t => {
  const mf2 = JSON.parse(getFixture('syndicate-to-provided.json'));
  const syndicationTargets = [];
  const result = getSyndicateToProperty(mf2, syndicationTargets);
  t.falsy(result);
});

test('Adds syndication target checked by client', t => {
  const mf2 = JSON.parse(getFixture('syndicate-to-provided.json'));
  const syndicationTargets = [{
    uid: 'https://example.website/'
  }];
  const result = getSyndicateToProperty(mf2, syndicationTargets);
  t.is(result[0], 'https://example.website/');
});

test('Adds syndication target not checked by client but forced by server', t => {
  const mf2 = false;
  const syndicationTargets = [{
    uid: 'https://example.website/',
    force: true
  }];
  const result = getSyndicateToProperty(mf2, syndicationTargets);
  t.is(result[0], 'https://example.website/');
});

test('Adds syndication target checked by client and forced by server', t => {
  const mf2 = JSON.parse(getFixture('syndicate-to-provided.json'));
  const syndicationTargets = [{
    uid: 'https://example.website/',
    force: true
  }];
  const result = getSyndicateToProperty(mf2, syndicationTargets);
  t.is(result[0], 'https://example.website/');
});

test('Adds syndication targets, one checked by client, one forced by server', t => {
  const mf2 = JSON.parse(getFixture('syndicate-to-provided.json'));
  const syndicationTargets = [{
    uid: 'https://example.website/'
  }, {
    uid: 'https://another-example.website/',
    force: true
  }];
  const result = getSyndicateToProperty(mf2, syndicationTargets);
  t.deepEqual(result, ['https://example.website/', 'https://another-example.website/']);
});

test('Returns mf2 item with all properties', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = mf2Properties(mf2);
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
  const result = mf2Properties(mf2, ['name', 'published']);
  t.deepEqual(result, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.'],
      published: ['2013-03-07']
    }
  });
});

test('Returns mf2 item with single property', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = mf2Properties(mf2, 'name');
  t.deepEqual(result, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.']
    }
  });
});

test('Returns mf2 item with empty object if property not found', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = mf2Properties(mf2, 'location');
  t.deepEqual(result, {
    properties: {}
  });
});

test('Throws error if mf2 has no items', t => {
  const mf2 = parser.mf2(getFixture('page.html'), {baseUrl: t.context.url});
  const error = t.throws(() => mf2Properties(mf2, 'name'));
  t.is(error.message, 'Source has no items');
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
