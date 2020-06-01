import test from 'ava';
import nock from 'nock';
import supertest from 'supertest';

import {app} from '../../../app/index.js';
import fixture from '../helpers/fixture.js';

const mockResponse = async query => {
  const request = supertest(app);
  return request.get('/micropub')
    .set('Accept', 'application/json')
    .query(query);
};

test('Returns configuration', async t => {
  const response = await mockResponse('q=config');
  t.is(response.status, 200);
});

test('Returns media endpoint', async t => {
  const response = await mockResponse('q=media-endpoint');
  t.truthy(response.body['media-endpoint']);
});

test('Returns supported syndication targets', async t => {
  const response = await mockResponse('q=syndicate-to');
  t.truthy(response.body['syndicate-to']);
});

test('Returns categories', async t => {
  const response = await mockResponse('q=category');
  t.truthy(response.body.categories);
});

test('Returns available configuration value', async t => {
  const response = await mockResponse('q=post-types');
  t.truthy(response.body['post-types']);
});

test('Returns 400 if unsupported parameter provided', async t => {
  const response = await mockResponse('q=foobar');
  t.is(response.status, 400);
  t.regex(response.error.text, /\bInvalid parameter: foobar\b/);
});

test('Returns list of previously published posts', async t => {
  const response = await mockResponse('q=source');
  t.deepEqual(response.body, {});
});

test('Returns mf2 for given source URL', async t => {
  const scope = nock('https://website.example')
    .get('/post.html')
    .reply(200, fixture('post.html'));
  const response = await mockResponse('q=source&properties[]=name&url=https://website.example/post.html');
  t.deepEqual(response.body, {
    type: ['h-entry'],
    properties: {
      name: ['I ate a cheese sandwich.']
    }
  });
  scope.done();
});

test('Returns 400 if source URL doesn’t contain microformats', async t => {
  const scope = nock('https://website.example')
    .get('/page.html')
    .reply(200, fixture('page.html'));
  const response = await mockResponse('q=source&properties[]=name&url=https://website.example/page.html');
  t.is(response.status, 400);
  t.regex(response.error.text, /\bSource has no items\b/);
  scope.done();
});

test('Returns 400 if source URL can’t be found', async t => {
  const scope = nock('https://website.example')
    .get('/post.html')
    .replyWithError('not found');
  const response = await mockResponse('q=source&properties[]=name&url=https://website.example/post.html');
  t.is(response.status, 400);
  t.regex(response.error.text, /\bnot found\b/);
  scope.done();
});

test('Returns 400 if unsupported query provided', async t => {
  const response = await mockResponse('foo=bar');
  t.is(response.status, 400);
  t.regex(response.error.text, /\bInvalid query\b/);
});

test('Returns 400 if request is missing query string', async t => {
  const response = await mockResponse(false);
  t.is(response.status, 400);
  t.regex(response.error.text, /\bInvalid query\b/);
});
