import test from 'ava';
import nock from 'nock';
import parser from 'microformats-parser';
import {getFixture} from '../helpers/fixture.js';
import {
  formEncodedToMf2,
  mf2Properties,
  normaliseMf2,
  normaliseAudio,
  normalisePhoto,
  normaliseVideo,
  url2Mf2
} from '../../lib/microformats.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/post.html'),
    url: 'https://website.example/post.html'
  };
});

test('Creates Microformats2 object from form-encoded request', t => {
  const result = formEncodedToMf2({
    h: 'entry',
    content: 'I+ate+a+cheese+sandwich.',
    category: ['foo', 'bar']
  });
  t.deepEqual(result, {
    type: ['h-entry'],
    properties: {
      content: ['I ate a cheese sandwich.'],
      category: ['foo', 'bar']
    }
  });
});

test('Returns mf2 item with all properties', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = mf2Properties(mf2);
  t.deepEqual(result, {
    type: ['h-entry'],
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
    type: ['h-entry'],
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
    type: ['h-entry'],
    properties: {
      name: ['I ate a cheese sandwich, which was nice.']
    }
  });
});

test('Returns mf2 item with empty object if property not found', t => {
  const mf2 = parser.mf2(getFixture('post.html'), {baseUrl: t.context.url});
  const result = mf2Properties(mf2, 'location');
  t.deepEqual(result, {
    type: ['h-entry'],
    properties: {}
  });
});

test('Throws error if mf2 has no items', t => {
  const mf2 = parser.mf2(getFixture('page.html'), {baseUrl: t.context.url});
  const error = t.throws(() => mf2Properties(mf2, 'name'));
  t.is(error.message, 'Source has no items');
});

test('Normalises mf2 object (few properties)', t => {
  const mf2 = {
    type: 'h-entry',
    properties: {
      name: ['foo']
    }
  };
  t.deepEqual(normaliseMf2(mf2), {
    type: 'h-entry',
    properties: {
      name: ['foo']
    }
  });
});

test('Normalises mf2 object (all properties)', t => {
  const mf2 = {
    type: 'h-entry',
    properties: {
      name: ['foo'],
      audio: ['http://foo.bar/baz.mp3', 'http://foo.bar/qux.mp3'],
      'mp-photo-alt': ['Baz', 'Qux'],
      photo: ['http://foo.bar/baz.jpg', 'http://foo.bar/qux.jpg'],
      video: ['http://foo.bar/baz.mp4', 'http://foo.bar/qux.mp4']
    }
  };
  t.deepEqual(normaliseMf2(mf2), {
    type: 'h-entry',
    properties: {
      name: ['foo'],
      audio: [
        {value: 'http://foo.bar/baz.mp3'},
        {value: 'http://foo.bar/qux.mp3'}
      ],
      photo: [
        {value: 'http://foo.bar/baz.jpg', alt: 'Baz'},
        {value: 'http://foo.bar/qux.jpg', alt: 'Qux'}
      ],
      video: [
        {value: 'http://foo.bar/baz.mp4'},
        {value: 'http://foo.bar/qux.mp4'}
      ]
    }
  });
});

test('Normalises audio property', t => {
  const audio = ['http://foo.bar/baz.mp3', 'http://foo.bar/qux.mp3'];
  t.deepEqual(normaliseAudio(audio), [
    {value: 'http://foo.bar/baz.mp3'},
    {value: 'http://foo.bar/qux.mp3'}
  ]);
});

test('Returns normalised audio property', t => {
  const audio = [
    {value: 'http://foo.bar/baz.mp3'},
    {value: 'http://foo.bar/qux.mp3'}
  ];
  t.deepEqual(normaliseAudio(audio), [
    {value: 'http://foo.bar/baz.mp3'},
    {value: 'http://foo.bar/qux.mp3'}
  ]);
});

test('Normalises photo property', t => {
  const photo = ['http://foo.bar/baz.jpg', 'http://foo.bar/qux.jpg'];
  t.deepEqual(normalisePhoto(photo), [
    {value: 'http://foo.bar/baz.jpg'},
    {value: 'http://foo.bar/qux.jpg'}
  ]);
});

test('Normalises photo property, adding provided text alternatives', t => {
  const photo = ['http://foo.bar/baz.jpg', 'http://foo.bar/qux.jpg'];
  const photoAlt = ['Baz', 'Qux'];
  t.deepEqual(normalisePhoto(photo, photoAlt), [
    {value: 'http://foo.bar/baz.jpg', alt: 'Baz'},
    {value: 'http://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
});

test('Returns normalised photo property', t => {
  const photo = [
    {value: 'http://foo.bar/baz.jpg', alt: 'Baz'},
    {value: 'http://foo.bar/qux.jpg', alt: 'Qux'}
  ];
  t.deepEqual(normalisePhoto(photo), [
    {value: 'http://foo.bar/baz.jpg', alt: 'Baz'},
    {value: 'http://foo.bar/qux.jpg', alt: 'Qux'}
  ]);
});

test('Normalises video property', t => {
  const video = ['http://foo.bar/baz.mp4', 'http://foo.bar/qux.mp4'];
  t.deepEqual(normaliseVideo(video), [
    {value: 'http://foo.bar/baz.mp4'},
    {value: 'http://foo.bar/qux.mp4'}
  ]);
});

test('Returns normalised video property', t => {
  const video = [
    {value: 'http://foo.bar/baz.mp4'},
    {value: 'http://foo.bar/qux.mp4'}
  ];
  t.deepEqual(normaliseVideo(video), [
    {value: 'http://foo.bar/baz.mp4'},
    {value: 'http://foo.bar/qux.mp4'}
  ]);
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
