import test from 'ava';
import nock from 'nock';
import parser from 'microformats-parser';
import {getFixture} from '../helpers/fixture.js';
import {formEncodedToMf2, url2Mf2, mf2Properties} from '../../lib/microformats.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/post.html'),
    url: 'https://website.example/post.html'
  };
});

test('Parses Microformats in form-encoded request', t => {
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
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(url2Mf2(t.context.url));
  t.is(error.message, 'not found');
  scope.done();
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
