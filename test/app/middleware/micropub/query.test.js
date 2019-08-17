const test = require('ava');
const request = require('supertest');

const config = require(process.env.PWD + '/app/config');
const store = require(process.env.PWD + '/lib/store');
const outputDir = process.env.PWD + '/.ava_output/micropub-query';

test.beforeEach(t => {
  config.data.dir = outputDir;
  t.context.app = request(require(process.env.PWD + '/app/server'));
});

test('Returns endpoint configuration', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({q: 'config'});
  t.is(response.status, 200);
  t.truthy(response.body['media-endpoint']);
});

test('Returns configured categories', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({q: 'category'});
  t.is(response.status, 200);
  t.truthy(response.body.categories);
});

test('Returns list of previously published posts', async t => {
  // Populate store with dummy data
  store.set('https://foo.bar/baz', {
    mf2: {
      type: ['h-entry'],
      properties: {
        name: ['foobar']
      }
    }
  }, 'posts');

  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({
      q: 'source'
    });
  t.is(response.status, 200);
  t.truthy(response.body.items);
});

test('Returns source (as mf2 object) for given URL', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({
      q: 'source',
      properties: 'name',
      url: 'https://paulrobertlloyd.com/2018/11/warp_and_weft'
    });
  t.is(response.status, 200);
  t.is(response.body.name[0], 'Warp and Weft');
});

test('Returns invalid request if source URL not found', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({
      q: 'source',
      properties: 'name',
      url: 'https://example.example'
    });
  t.is(response.status, 404);
  t.is(response.body.error, 'not_found');
});

test('Returns configured property if matches provided query', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({q: 'syndicate-to'});
  t.is(response.status, 200);
  t.truthy(response.body['syndicate-to']);
});

test('Rejects unknown endpoint query', async t => {
  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({q: 'unknown'});
  t.is(response.status, 400);
  t.is(response.body.error, 'invalid_request');
});
