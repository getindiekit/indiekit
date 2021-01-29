/* eslint-disable camelcase */
import test from 'ava';
import nock from 'nock';
import {TwitterSyndicator} from '../index.js';

test.beforeEach(t => {
  t.context = {
    apiResponse: {
      id_str: '1234567890987654321',
      user: {screen_name: 'username'}
    },
    options: {
      apiKey: '0123456789abcdefghijklmno',
      apiKeySecret: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0123456789',
      accessTokenKey: 'ABCDEFGHIJKLMNabcdefghijklmnopqrstuvwxyz0123456789',
      accessTokenSecret: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN',
      user: 'username'
    },
    properties: {
      name: 'Lunchtime',
      content: {
        html: '<p>I ate a cheese sandwich, which was <em>nice</em>.</p>',
        text: 'I ate a cheese sandwich, which was nice.'
      },
      url: 'https://foo.bar/lunchtime',
      'post-type': 'article'
    }
  };
});

test('Gets assets path', t => {
  const result = new TwitterSyndicator(t.context.options);
  t.regex(result.assetsPath, /syndicator-twitter\/assets/);
});

test('Gets info', t => {
  const result = new TwitterSyndicator(t.context.options);
  t.false(result.info.checked);
  t.is(result.info.name, 'username on Twitter');
  t.is(result.info.uid, 'https://twitter.com/username');
  t.truthy(result.info.service);
});

test('Gets UID', t => {
  const result = new TwitterSyndicator(t.context.options);
  t.is(result.uid, 'https://twitter.com/username');
});

test('Returns syndicated URL', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(200, t.context.apiResponse);
  const syndicator = new TwitterSyndicator(t.context.options);
  const result = await syndicator.syndicate(t.context.properties);
  t.is(result, 'https://twitter.com/username/status/1234567890987654321');
  scope.done();
});

test('Throws error getting syndicated URL if no API keys provided', async t => {
  const scope = nock('https://api.twitter.com')
    .post('/1.1/statuses/update.json')
    .reply(401, {
      errors: [{
        message: 'Could not authenticate you.'
      }]
    });
  const syndicator = new TwitterSyndicator({});
  const error = await t.throwsAsync(syndicator.syndicate(t.context.properties));
  t.is(error.message, 'Could not authenticate you.');
  scope.done();
});
