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

test('Thorws error if problem with URL provided', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(customConfigService(t.context.url));
  t.is(error.message, 'not found');
  scope.done();
});
