import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';
import {getFixture} from '@indiekit-test/get-fixture';

test.beforeEach(async t => {
  const request = await server;
  t.context.request = request.get('/micropub')
    .set('Accept', 'application/json');
});

test('Returns configuration', async t => {
  const response = await t.context.request.query('q=config');
  t.is(response.statusCode, 200);
});

test('Returns media endpoint', async t => {
  const response = await t.context.request.query('q=media-endpoint');
  t.truthy(response.body['media-endpoint']);
});

test('Returns supported syndication targets', async t => {
  const response = await t.context.request.query('q=syndicate-to');
  t.truthy(response.body['syndicate-to']);
});

test('Returns categories', async t => {
  const response = await t.context.request.query('q=category');
  t.truthy(response.body.categories);
});

test('Returns available configuration value', async t => {
  const response = await t.context.request.query('q=post-types');
  t.truthy(response.body['post-types']);
});

test('Returns list of previously published posts', async t => {
  const response = await t.context.request.query('q=source');
  t.truthy(response.body.items);
});

test('Returns mf2 for given source URL', async t => {
  const scope = nock('https://website.example')
    .get('/post.html')
    .reply(200, getFixture('html/post.html'));
  const response = await t.context.request.query('q=source&properties[]=name&url=https://website.example/post.html');
  t.deepEqual(response.body, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.']
    }
  });
  scope.done();
});

test('Returns 400 if source URL has no items', async t => {
  const scope = nock('https://website.example')
    .get('/page.html')
    .reply(200, getFixture('html/page.html'));
  const response = await t.context.request.query('q=source&properties[]=name&url=https://website.example/page.html');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Source has no items');
  scope.done();
});

test('Returns 400 if source URL can’t be found', async t => {
  const scope = nock('https://website.example')
    .get('/post.html')
    .replyWithError('Not found');
  const response = await t.context.request.query('q=source&properties[]=name&url=https://website.example/post.html');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Not found');
  scope.done();
});

test('Returns 400 if unsupported parameter provided', async t => {
  const response = await t.context.request.query('q=foobar');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Invalid parameter: foobar');
});

test('Returns 400 if unsupported query provided', async t => {
  const response = await t.context.request.query('foo=bar');
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Invalid query');
});

test('Returns 400 if request is missing query string', async t => {
  const response = await t.context.request.query(false);
  t.is(response.statusCode, 400);
  t.is(response.body.error_description, 'Invalid query');
});
