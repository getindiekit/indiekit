import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {testConfig} from '@indiekit-test/config';
import {Indiekit} from '../../index.js';
import {Cache} from '../../lib/cache.js';

test.beforeEach(async t => {
  const config = await testConfig();
  const indiekit = new Indiekit({config});
  const {application} = await indiekit.bootstrap();

  t.context = {
    cacheCollection: application.cache,
    url: `${process.env.TEST_PUBLICATION_URL}categories.json`,
  };
});

test('Returns data from remote file and saves to cache', async t => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get('/categories.json')
    .reply(200, ['Foo', 'Bar']);
  const cache = new Cache(t.context.cacheCollection);

  const result = await cache.json('test1', t.context.url);

  t.is(result.source, t.context.url);
});

test.serial('Throws error if remote file not found', async t => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get('/categories.json')
    .replyWithError('Not found');
  const cache = new Cache(t.context.cacheCollection);

  await t.throwsAsync(cache.json('test2', t.context.url), {
    message: `Unable to fetch ${t.context.url}: Not found`,
  });
});

test('Gets data from cache', async t => {
  t.context.cacheCollection.insertOne({
    key: 'test3',
    url: t.context.url,
    data: ['Foo', 'Bar'],
  });
  const cache = new Cache(t.context.cacheCollection);

  // Request item and add to cache
  await cache.json('test3', t.context.url);

  // Retrieve item from cache
  const result = await cache.json('test3', t.context.url);

  t.is(result.source, 'cache');
});
