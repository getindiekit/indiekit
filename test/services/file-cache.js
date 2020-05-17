import test from 'ava';
import nock from 'nock';

import {client} from '../../config/server.js';
import fileCacheService from '../../services/file-cache.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/categories.json'),
    url: 'https://website.example/categories.json'
  };
});

test.afterEach(() => {
  client.flushall();
});

test('Gets data from remote and saves to Redis cache', async t => {
  const scope = t.context.nock.reply(200, ['Foo', 'Bar']);
  const result = await fileCacheService('category', t.context.url);

  t.is(result.source, 'fetch');
  scope.done();
});

test('Throws error if remote not found', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(fileCacheService('file', t.context.url));

  t.is(error.message, 'not found');
  scope.done();
});

test('Gets data from Redis cache', async t => {
  const scope = t.context.nock.reply(200, ['Foo', 'Bar']);
  await fileCacheService('file', t.context.url);
  const result = await fileCacheService('file', t.context.url);

  t.is(result.source, 'cache');
  scope.done();
});
