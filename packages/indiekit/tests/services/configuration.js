import test from 'ava';
import nock from 'nock';
import defaultConfig from '@indiekit/config-jekyll';
import fixture from '../helpers/fixture.js';
import {mockClient} from '../helpers/database.js';
import {getCustomConfig, getDefaultConfig, getConfig} from '../../services/configuration.js';

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
  const result = await getCustomConfig(mockClient, t.context.url);
  t.deepEqual(result, {
    'slug-separator': '$'
  });
  scope.done();
});

test('Returns empty object if no URL provided', async t => {
  const result = await getCustomConfig(mockClient, false);
  t.deepEqual(result, {});
});

test('Throws error if URL not accessible', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(getCustomConfig(mockClient, t.context.url));
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});

test('Returns configuration object for Jekyll', async t => {
  const result = await getDefaultConfig('jekyll');
  t.regex(result['post-types'][0].post.path, /^_posts/);
});

test('Merges values from custom and default configurations', t => {
  const customConfig = JSON.parse(fixture('custom-config.json'));
  const result = getConfig(customConfig, defaultConfig);
  t.is(result['syndicate-to'][0].name, '@username on Twitter');
  t.is(result['slug-separator'], '_');
  t.is(result['post-types'][0].name, 'Journal entry');
});
