import test from 'ava';
import nock from 'nock';
import {mockClient} from '../helpers/database.js';
import CacheService from '../../services/cache.js';

const cache = new CacheService(mockClient);

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/categories.json'),
    url: 'https://website.example/categories.json'
  };
});

test.afterEach.always(() => {
  mockClient.flushall();
});

test('Returns data from remote file and saves to Redis cache', async t => {
  const scope = t.context.nock.reply(200, ['Foo', 'Bar']);
  const result = await cache.json('category', t.context.url);
  t.is(result.source, 'fetch');
  scope.done();
});

test('Throws error if remote file not found', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(cache.json('file', t.context.url));
  t.is(error.message, 'not found');
  scope.done();
});

test('Gets data from Redis cache', async t => {
  const scope = t.context.nock.reply(200, ['Foo', 'Bar']);
  await cache.json('file', t.context.url);
  const result = await cache.json('file', t.context.url);
  t.is(result.source, 'cache');
  scope.done();
});
