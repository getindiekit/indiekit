import test from 'ava';
import nock from 'nock';
import {mongodbConfig} from '../../config/mongodb.js';
import {Cache} from '../../lib/cache.js';

test.beforeEach(async t => {
  const database = await mongodbConfig(process.env.TEST_MONGODB_URL);
  const collection = await database.collection('cache');

  t.context = {
    cache: new Cache(collection),
    nock: nock('https://website.example').get('/categories.json'),
    url: 'https://website.example/categories.json'
  };
});

test.afterEach.always(async () => {
  const database = await mongodbConfig(process.env.TEST_MONGODB_URL);
  await database.dropDatabase();
});

test.serial('Returns data from remote file and saves to cache', async t => {
  const scope = t.context.nock.reply(200, ['Foo', 'Bar']);
  const result = await t.context.cache.json('category', t.context.url);
  t.is(result.source, t.context.url);
  scope.done();
});

test.serial('Throws error if remote file not found', async t => {
  const scope = t.context.nock.replyWithError('Not found');
  const error = await t.throwsAsync(t.context.cache.json('file', t.context.url));
  t.is(error.message, `Unable to fetch ${t.context.url}: Not found`);
  scope.done();
});

test.serial('Gets data from cache', async t => {
  const cache = new Cache({
    findOne: async () => ({
      souce: 'cache',
      date: {}
    })
  });

  await cache.json('file', t.context.url);
  const result = await cache.json('file', t.context.url);
  t.is(result.source, 'cache');
});
