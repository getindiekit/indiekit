import test from 'ava';
import supertest from 'supertest';

import app from '../../index.js';
const request = supertest(app);

const mockResponse = async query => {
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
