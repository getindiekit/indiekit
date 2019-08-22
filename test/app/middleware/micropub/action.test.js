const test = require('ava');
const nock = require('nock');
const request = require('supertest');

const app = request(require(process.env.PWD + '/app/server'));
const config = require(process.env.PWD + '/app/config');
const store = require(process.env.PWD + '/lib/store');

test.beforeEach(t => {
  config.data.dir = process.env.PWD + `/.ava_output/${test.meta.file}`;
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
  t.context.postUrl = `${process.env.INDIEKIT_URL}/notes/2019/08/17/baz`;
  t.context.postData = {
    post: {
      type: 'note',
      path: '_notes/2019-08-17-baz.md',
      url: t.context.postUrl
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        content: ['Baz']
      },
      slug: ['baz']
    }
  };
});

test('Returns 404 if specified URL not found in store', async t => {
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send({
      action: 'update',
      url: 'http://example.example'
    });
  t.is(response.status, 404);
  t.is(response.body.error, 'Not found');
});

test('Returns 501 if update action requested', async t => {
  store.set(t.context.postUrl, t.context.postData);
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send({
      action: 'update',
      url: t.context.postUrl
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
  store.set(t.context.postUrl, t.context.postData);
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send({
      action: 'delete',
      url: t.context.postUrl
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
  store.set(t.context.postUrl, t.context.postData);
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send({
      action: 'undelete',
      url: t.context.postUrl
    });

  // Test assertions
  t.is(response.status, 200);
  t.is(response.body.success, 'delete_undelete');
  scope.done();
});
