const fs = require('fs-extra');
const test = require('ava');
const nock = require('nock');
const request = require('supertest');

const config = require(process.env.PWD + '/app/config');
const store = require(process.env.PWD + '/lib/store');
const outputDir = process.env.PWD + '/.ava_output/micropub-action';

test.before(t => {
  config.data.dir = outputDir;
  t.context.app = request(require(process.env.PWD + '/app/server'));
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Rejects action with no specified URL', async t => {
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({action: 'delete'});
  t.is(response.status, 400);
  t.is(response.body.error, 'invalid_request');
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
  t.is(response.body.error, 'not_found');
});

test('Returns 501 if update action requested', async t => {
  store.set('https://foo.bar', {post: {path: 'foo'}});
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({
      action: 'update',
      url: 'https://foo.bar'
    });
  t.is(response.status, 501);
  t.is(response.body.error, 'not_implemented');
});

test.skip('Creates, deletes and undeletesa a post', async t => {
  // Mock GitHub delete file request
  const scope = nock('https://api.github.com')
    .get(/\bbaz.txt\b/g)
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b'
    })
    .delete(/\bbaz.txt\b/g)
    .reply(200, {
      content: null,
      commit: {
        message: `Delete message\nwith ${config.name}`
      }
    });

  // Setup
  store.set('https://foo.bar', {post: {path: 'foo'}});
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({
      action: 'delete',
      url: 'https://foo.bar/baz.txt'
    });

  // Test assertions
  t.is(response.status, 200);
  t.is(response.body.success, 'delete');
  scope.done();
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
