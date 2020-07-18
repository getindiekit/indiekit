import test from 'ava';
import {JekyllConfig} from '../../../config-jekyll/index.js';
import {
  decodeQueryParameter,
  excerptString,
  getPostTypeConfig,
  randomString,
  renderPath,
  addProperties,
  deleteEntries,
  deleteProperties,
  replaceEntries
} from '../../lib/utils.js';

test.beforeEach(t => {
  t.context = {
    config: new JekyllConfig().config,
    properties: {
      content: ['hello world'],
      published: ['2019-08-17T23:56:38.977+01:00'],
      category: ['foo', 'bar'],
      slug: ['baz']
    }
  };
});

test('Decodes form-encoded query parameter', t => {
  const result = decodeQueryParameter('https%3A%2F%2Ffoo.bar');
  t.is(result, 'https://foo.bar');
});

test('Excerpts first n words from a string', t => {
  const string = 'The quick fox jumped over the lazy fox';
  const result = excerptString(string, 5);
  t.is(result, 'The quick fox jumped over');
});

test('Get post type configuration for a given type', t => {
  const result = getPostTypeConfig('note', t.context.config);
  t.is(result.name, 'Note');
});

test('Generates random alpha-numeric string, 5 characters long', t => {
  const result = randomString();
  t.regex(result, /[\d\w]{5}/g);
});

test('Renders path from URI template and properties', t => {
  const properties = {
    slug: 'foo',
    published: ['2020-01-01']
  };
  const template = '{yyyy}/{MM}/{slug}';
  const result = renderPath(template, properties);
  t.is(result, '2020/01/foo');
});

test('Add properties to object', t => {
  const additions = {
    syndication: ['http://website.example']
  };
  const result = addProperties(t.context.properties, additions);
  t.deepEqual(result.syndication, ['http://website.example']);
});

test('Add properties to existing object', t => {
  const additions = {
    category: ['baz']
  };
  const result = addProperties(t.context.properties, additions);
  t.deepEqual(result.category, ['foo', 'bar', 'baz']);
});

test('Delete individual entries for properties of an object', t => {
  const deletions = {
    category: ['foo']
  };
  const result = deleteEntries(t.context.properties, deletions);
  t.deepEqual(result.category, ['bar']);
});

test('Delete individual entries for properties of an object (removing property if last entry removed)', t => {
  const deletions = {
    category: ['foo', 'bar']
  };
  const result = deleteEntries(t.context.properties, deletions);
  t.falsy(result.category);
});

test('Delete individual entries for properties of an object (ignores properties that don’t exist)', t => {
  const deletions = {
    tags: ['foo', 'bar']
  };
  const result = deleteEntries(t.context.properties, deletions);
  t.falsy(result.tags);
});

test('Throws error if requested deletion is not an array', t => {
  const deletions = {
    category: 'foo'
  };
  const error = t.throws(() => deleteEntries(t.context.properties, deletions));
  t.is(error.message, 'category should be an array');
});

test('Delete properties of an object', t => {
  const deletions = ['category'];
  const result = deleteProperties(t.context.properties, deletions);
  t.falsy(result.category);
});

test('Replace entries of a property', t => {
  const replacements = {
    content: ['hello moon']
  };
  const result = replaceEntries(t.context.properties, replacements);
  t.deepEqual(result.content, ['hello moon']);
});
