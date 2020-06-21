import test from 'ava';
import nock from 'nock';

import {isValidUrl} from '../../services/validation.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/config.json'),
    url: 'https://website.example/config.json',
    config: {
      'slug-separator': '$'
    }
  };
});

test('Throws error if URL is not valid', async t => {
  const error = await t.throwsAsync(isValidUrl('foobar'));
  t.is(error.message, 'Enter a valid URL, including protocol');
});

test('Throws error if URL does not resolve', async t => {
  const scope = t.context.nock.replyWithError('not found');
  const error = await t.throwsAsync(isValidUrl(t.context.url));
  t.is(error.message, 'Enter a URL that is publicly accessible');
  scope.done();
});

test('Throws error if file at URL can’t be found', async t => {
  const scope = t.context.nock.reply(404);
  const error = await t.throwsAsync(isValidUrl(t.context.url));
  t.is(error.message, 'File not found. Enter a URL that is publicly accessible');
  scope.done();
});

test('Throws error if file at URL is not JSON', async t => {
  const scope = t.context.nock.reply(200, '<html></html>');
  const error = await t.throwsAsync(isValidUrl(t.context.url, 'json'));
  t.is(error.message, 'File should use the JSON format');
  scope.done();
});
