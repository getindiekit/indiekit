const test = require('ava');
const nock = require('nock');
const request = require('supertest');

const config = require(process.env.PWD + '/app/config');
const store = require(process.env.PWD + '/lib/store');
const outputDir = process.env.PWD + '/.ava_output/micropub-action';

test.beforeEach(t => {
  config.data.dir = outputDir;
  t.context.app = request(require(process.env.PWD + '/app/server'));
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Returns 404 if specified URL not found in store', async t => {
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({
      action: 'update',
      url: 'http://example.example'
    });
  t.is(response.status, 404);
  t.is(response.body.error, 'Not found');
});

test('Returns 501 if update action requested', async t => {
  store.set('https://foo.bar/baz.md', {post: {path: 'baz.md'}});
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({
      action: 'update',
      url: 'https://foo.bar/baz.md'
    });
  t.is(response.status, 501);
  t.is(response.body.error, 'Not implemented');
});

test('Deletes a post', async t => {
  // Mock GitHub delete file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b',
      type: 'file',
      name: 'baz.md',
      path: 'baz.md'
    })
    .delete(uri => uri.includes('baz.md'))
    .reply(200, {
      content: null,
      commit: {
        message: `Delete message\nwith ${config.name}`
      }
    });

  // Setup
  store.set('https://foo.bar/baz.md', {post: {path: 'baz.md'}});
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({
      action: 'delete',
      url: 'https://foo.bar/baz.md'
    });

  // Test assertions
  t.is(response.status, 200);
  t.is(response.body.success, 'delete');
  scope.done();
});

test('Undeletes a post', async t => {
  // Mock GitHub create file request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  store.set('https://foo.bar/baz.md', {
    post: {
      type: 'note',
      path: 'baz.md'
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        content: ['Baz']
      },
      slug: ['baz']
    }
  });
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({
      action: 'undelete',
      url: 'https://foo.bar/baz.md'
    });

  // Test assertions
  t.is(response.status, 200);
  t.is(response.body.success, 'delete_undelete');
  scope.done();
});
