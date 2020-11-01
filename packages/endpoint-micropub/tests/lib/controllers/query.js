import test from 'ava';
import nock from 'nock';
import supertest from 'supertest';
import {serverConfig} from '../../../../indiekit/config/server.js';
import {Indiekit} from '../../../../indiekit/index.js';
import {getFixture} from '../../helpers/fixture.js';

const mockResponse = async query => {
  const indiekit = new Indiekit();
  const config = await indiekit.init();
  const request = supertest(serverConfig(config));
  return request.get('/micropub')
    .set('Accept', 'application/json')
    .query(query);
};

test('Returns configuration', async t => {
  const response = await mockResponse('q=config');
  t.is(response.statusCode, 200);
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

test('Returns list of previously published posts', async t => {
  const response = await mockResponse('q=source');
  t.truthy(response.body.items);
});

test('Returns mf2 for given source URL', async t => {
  const scope = nock('https://website.example')
    .get('/post.html')
    .reply(200, getFixture('post.html'));
  const response = await mockResponse('q=source&properties[]=name&url=https://website.example/post.html');
  t.deepEqual(response.body, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.']
    }
  });
  scope.done();
});

test('Returns 400 if source URL doesn’t contain microformats', async t => {
  const scope = nock('https://website.example')
    .get('/page.html')
    .reply(200, getFixture('page.html'));
  const response = await mockResponse('q=source&properties[]=name&url=https://website.example/page.html');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Source has no items');
  scope.done();
});

test('Returns 400 if source URL can’t be found', async t => {
  const scope = nock('https://website.example')
    .get('/post.html')
    .replyWithError('Not found');
  const response = await mockResponse('q=source&properties[]=name&url=https://website.example/post.html');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Not found');
  scope.done();
});

test('Returns 400 if unsupported parameter provided', async t => {
  const response = await mockResponse('q=foobar');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Invalid parameter: foobar');
});

test('Returns 400 if unsupported query provided', async t => {
  const response = await mockResponse('foo=bar');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Invalid query');
});

test('Returns 400 if request is missing query string', async t => {
  const response = await mockResponse(false);
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Invalid query');
});
