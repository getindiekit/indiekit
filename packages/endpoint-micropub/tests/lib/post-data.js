import test from 'ava';
import {JekyllPreset} from '../../../preset-jekyll/index.js';
import {postData} from '../../lib/post-data.js';

test.beforeEach(t => {
  t.context = {
    publication: {
      me: 'https://website.example',
      postTypes: new JekyllPreset().postTypes,
      posts: {
        findOne: async url => ({
          path: 'foo',
          properties: {
            content: 'hello world',
            published: '2019-08-17T23:56:38.977+01:00',
            category: ['foo', 'bar'],
            slug: 'baz',
            'post-type': 'note',
            url
          },
          mf2: {
            type: ['h-entry'],
            properties: {
              content: ['hello world'],
              published: ['2019-08-17T23:56:38.977+01:00'],
              category: ['foo', 'bar'],
              slug: ['baz']
            }
          }
        })
      }
    },
    url: 'https://website.example/foo'
  };
});

test('Creates post data', async t => {
  const mf2 = {
    type: ['h-entry'],
    properties: {
      published: ['2020-07-26T20:10:57.062Z'],
      name: ['Foo'],
      slug: ['foo']
    }
  };
  const result = await postData.create(t.context.publication, mf2);
  t.is(result.properties['post-type'], 'note');
  t.is(result.properties.slug, 'foo');
  t.is(result.properties.type, 'entry');
  t.is(result.properties.url, 'https://website.example/notes/2020/07/26/foo');
});

test('Throws error creating post data without microformats data', async t => {
  const error = await t.throwsAsync(
    postData.create(t.context.publication, false)
  );
  t.is(error.message, 'No microformats included in request');
});

test('Reads post data', async t => {
  const result = await postData.read(t.context.publication, t.context.url);
  t.is(result.properties['post-type'], 'note');
});

test('Throws error reading post data', async t => {
  const error = await t.throwsAsync(
    postData.read(false, t.context.url)
  );
  t.is(error.message, 'No publication configuration provided');
});

test('Updates post by adding properties', async t => {
  const operation = {add: {syndication: ['http://website.example']}};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.truthy(result.properties.syndication);
  t.truthy(result.mf2.properties.syndication);
});

test('Updates post by replacing properties', async t => {
  const operation = {replace: {content: ['hello moon']}};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.is(result.properties.content, 'hello moon');
  t.deepEqual(result.mf2.properties.content, ['hello moon']);
});

test('Updates post by deleting entries', async t => {
  const operation = {delete: {category: ['foo']}};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.is(result.properties.category, 'bar');
  t.deepEqual(result.mf2.properties.category, ['bar']);
});

test('Updates post by deleting properties', async t => {
  const operation = {delete: ['category']};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.falsy(result.properties.category);
  t.falsy(result.mf2.properties.category);
});

test('Throws error updating post data', async t => {
  const operation = {delete: ['category']};
  const error = await t.throwsAsync(
    postData.update(false, t.context.url, operation)
  );
  t.is(error.message, 'No publication configuration provided');
});
