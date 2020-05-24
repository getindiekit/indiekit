import test from 'ava';
import nock from 'nock';

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

test('Returns configuration object', async t => {
  const scope = t.context.nock.reply(200, t.context.config);
  const result = await customConfigService(t.context.url);
  t.deepEqual(result, {
    'slug-separator': '$'
  });
  scope.done();
});

test('Returns empty object if no URL provided', async t => {
  const result = await customConfigService(false);
  t.deepEqual(result, {});
});

test('Throws error if URL not accessible', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(customConfigService(t.context.url));
  t.is(error.message, 'Custom configuration URL should be publicly accessible');
  scope.done();
});

test('Throws error if file at URL is not JSON', async t => {
  const scope = t.context.nock.reply(200, '<html></html>');
  const error = await t.throwsAsync(customConfigService(t.context.url));
  t.is(error.message, 'Custom configuration file should use the JSON format');
  scope.done();
});
