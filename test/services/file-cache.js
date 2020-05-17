import test from 'ava';
import {client} from '../../config/server.js';
import fileCacheService from '../../services/file-cache.js';

test.afterEach(() => {
  client.flushall();
});

test('Gets data from remote and saves to Redis cache', async t => {
  const url = 'https://paulrobertlloyd.com/categories/index.json';
  const result = await fileCacheService('category', url);
  t.is(result.source, 'fetch');
});

test('Throws error if remote not found', async t => {
  const url = null;
  const error = await t.throwsAsync(fileCacheService('file', url));
  t.regex(error.message, /\bReceived null\b/);
});

test('Gets data from Redis cache', async t => {
  const url = 'https://paulrobertlloyd.com/categories/index.json';
  await fileCacheService('file', url);
  const result = await fileCacheService('file', url);
  t.is(result.source, 'cache');
});
