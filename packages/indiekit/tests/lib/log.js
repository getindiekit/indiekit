import test from 'ava';
import {mockClient} from '../helpers/database.js';
import {Log} from '../../lib/log.js';

const log = new Log(mockClient, 'test');

test.beforeEach(() => {
  log.set('https://website.example/foo', {
    type: 'note',
    path: 'foo',
    url: 'https://website.example/foo',
    mf2: {
      type: 'h-entry',
      properties: {
        name: 'foo'
      }
    }
  });
  log.set('https://website.example/bar', {
    type: 'article',
    path: 'foo',
    url: 'https://website.example/bar',
    mf2: {
      type: 'h-entry',
      properties: {
        name: 'bar'
      }
    }
  });
});

test.afterEach.always(() => {
  mockClient.flushall();
});

test('Gets an object by field name', async t => {
  const result = await log.get('https://website.example/foo');
  t.is(result.type, 'note');
});

test('Throws error getting an object for nonexistent key', async t => {
  const error = await t.throwsAsync(
    log.get('https://website.example/qux')
  );
  t.is(error.message, 'No value found for https://website.example/qux');
});

test('Gets an array of all objects, keyed by field name', async t => {
  const result = await log.getAll();
  t.is(result['https://website.example/foo'].type, 'note');
  t.is(result['https://website.example/bar'].type, 'article');
});

test('Gets an array of all objects, returning only those with specified object key', async t => {
  const result = await log.selectFromAll('mf2');
  t.is(result[0].properties.name, 'foo');
  t.is(result[1].properties.name, 'bar');
});

test('Returns an empty array if no objects have specified key', async t => {
  const log2 = new Log(mockClient, 'test2');
  const result = await log2.selectFromAll('foo');
  t.deepEqual(result, []);
});

test('Sets a value in log with a given key', async t => {
  log.set('https://website.example/baz', {
    type: 'article',
    path: 'baz',
    url: 'https://website.example/baz',
    mf2: {
      type: 'h-entry',
      properties: {
        name: 'baz'
      }
    }
  });
  const result = await log.selectFromAll('mf2');
  t.is(result[2].properties.name, 'baz');
});
