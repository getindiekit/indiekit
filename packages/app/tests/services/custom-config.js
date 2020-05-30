import test from 'ava';
import nock from 'nock';
import {mockClient} from '../helpers/database.js';
import customConfigService from '../../services/custom-config.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/config.json'),
    url: 'https://website.example/config.json',
    config: {
      'slug-separator': '$'
    }
  };
});

test.afterEach.always(() => {
  mockClient.flushall();
});

test('Returns configuration object', async t => {
  const scope = t.context.nock.reply(200, t.context.config);
  const result = await customConfigService(mockClient, t.context.url);
  t.deepEqual(result, {
    'slug-separator': '$'
  });
  scope.done();
});

test('Returns empty object if no URL provided', async t => {
  const result = await customConfigService(mockClient, false);
  t.deepEqual(result, {});
});

test('Throws error if URL not accessible', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(customConfigService(mockClient, t.context.url));
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});
