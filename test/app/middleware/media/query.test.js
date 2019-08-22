const test = require('ava');
const request = require('supertest');

const app = request(require(process.env.PWD + '/app/server'));
const config = require(process.env.PWD + '/app/config');
const store = require(process.env.PWD + '/lib/store');

test.beforeEach(() => {
  config.data.dir = process.env.PWD + `/.ava_output/${test.meta.file}`;
});

test('Returns URL of last uploaded file', async t => {
  // Populate store with dummy data
  store.set('https://foo.bar/baz.gif', {
    upload: {
      basename: 'baz.gif',
      path: 'baz.gif',
      url: 'https://foo.bar/baz.gif'
    }
  }, 'media');

  // Setup
  const response = await app.get('/media')
    .set('Accept', 'application/json')
    .query({q: 'last'});

  // Test assertions
  t.is(response.status, 200);
  t.truthy(response.body.url, 'https://foo.bar/baz.gif');
});

test('Rejects unknown endpoint query', async t => {
  const response = await app.get('/media')
    .set('Accept', 'application/json')
    .query({q: 'unknown'});
  t.is(response.status, 400);
  t.is(response.body.error, 'invalid_request');
});
