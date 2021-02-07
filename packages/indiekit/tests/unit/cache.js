import test from 'ava';
import nock from 'nock';
import {indiekitConfig} from '@indiekit-test/config';
import {Cache} from '../../lib/cache.js';

test.beforeEach(async t => {
  const {application} = await indiekitConfig;

  t.context = {
    cache: new Cache(application.cache),
    url: 'https://website.example/categories.json'
  };
});

test.serial('Returns data from remote file and saves to cache', async t => {
  nock('https://website.example')
    .get('/categories.json')
    .reply(200, ['Foo', 'Bar']);

  const result = await t.context.cache.json('category', t.context.url);

  t.is(result.source, t.context.url);
});

test.serial('Throws error if remote file not found', async t => {
  nock('https://website.example')
    .get('/categories.json')
    .replyWithError('Not found');

  await t.throwsAsync(t.context.cache.json('file', t.context.url), {
    message: `Unable to fetch ${t.context.url}: Not found`
  });
});

test.serial('Gets data from cache', async t => {
  const cache = new Cache({
    findOne: async () => ({
      souce: 'cache',
      data: {}
    })
  });
  await cache.json('file', t.context.url);

  const result = await cache.json('file', t.context.url);

  t.is(result.source, 'cache');
});
