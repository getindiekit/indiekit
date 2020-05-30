import test from 'ava';
import nock from 'nock';
import {mockClient} from '../helpers/database.js';
import categoriesService from '../../services/categories.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/categories.json'),
    categoriesWithArray: ['foo', 'bar'],
    categoriesWithUrl: {
      url: 'https://website.example/categories.json'
    }
  };
});

test.afterEach.always(() => {
  mockClient.flushall();
});

test('Returns an array of available categories', async t => {
  const result = await categoriesService(mockClient, t.context.categoriesWithArray);
  t.deepEqual(result, ['foo', 'bar']);
});

test('Returns array of categories from remote JSON file', async t => {
  const scope = t.context.nock.reply(200, ['foo', 'bar']);
  const result = await categoriesService(mockClient, t.context.categoriesWithUrl);
  t.deepEqual(result, ['foo', 'bar']);
  scope.done();
});

test('Returns empty array if remote file not found', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(categoriesService(mockClient, t.context.categoriesWithUrl));
  t.is(error.message, 'not found');
  scope.done();
});
