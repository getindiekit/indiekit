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
        content: ['hello world'],
        published: ['2019-08-17T23:56:38.977+01:00'],
        category: ['foo', 'bar'],
        slug: ['baz']
      }
    }
  };
  store.set(t.context.postUrl, t.context.postData);
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

test.serial('Deletes a post', async t => {
  // Mock GitHub delete file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b'
    })
    .delete(uri => uri.includes('baz.md'))
    .reply(200, {
      content: null,
      commit: {
        message: `Delete message\nwith ${config.name}`
      }
    });

  // Setup
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

test.serial('Throws error deleting if GitHub responds with an error', async t => {
  // Mock GitHub delete file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .replyWithError('not found');

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
  t.is(response.status, 500);
  t.regex(response.body.error_description, /\bnot found\b/);
  scope.done();
});

test.serial('Undeletes a post', async t => {
  // Mock GitHub create file request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
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

test.serial('Throws error undeleting if GitHub responds with an error', async t => {
  // Mock GitHub create file request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('baz.md'))
    .replyWithError('not found');

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
  t.is(response.status, 500);
  t.regex(response.body.error_description, /\bnot found\b/);
  scope.done();
});

test.serial('Updates a post by replacing its content', async t => {
  // Mock GitHub create file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send({
      action: 'update',
      url: t.context.postUrl,
      replace: {
        content: ['hello moon']
      }
    });

  // Test assertions
  t.is(response.status, 200);
  t.is(response.body.success, 'update');
  scope.done();
});

test.serial('Throws error updating if GitHub responds with an error', async t => {
  // Mock GitHub create file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('baz.md'))
    .replyWithError('not found');

  // Setup
  store.set('https://foo.bar/baz', t.context.postData);
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send({
      action: 'update',
      url: 'https://foo.bar/baz',
      replace: {
        content: ['hello moon']
      }
    });

  // Test assertions
  t.is(response.status, 500);
  t.regex(response.body.error_description, /\bnot found\b/);
  scope.done();
});

test.serial('Returns 201 if updating property causes URL to change', async t => {
  // Mock GitHub create file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('new_slug.md'))
    .reply(404)
    .put(uri => uri.includes('new_slug.md'))
    .reply(200);

  // Setup
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .send({
      action: 'update',
      url: t.context.postUrl,
      replace: {
        slug: ['new_slug']
      }
    });

  // Test assertions
  t.is(response.status, 201);
  t.regex(response.header.location, /\bnew_slug\b/g);
  t.is(response.body.success, 'update');
  scope.done();
});

test.afterEach(t => {
  if (!nock.isDone()) {
    t.log('Not all nock interceptors were used!');
    nock.cleanAll();
  }
});
