const request = require('supertest');
const test = require('ava');

// Tests
test.before(t => {
  t.context.app = request(require(process.env.PWD + '/app/server'));
});

test('Returns 201 if cache successfully purged', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('purge=cache')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 201);
  t.is(response.body.success_description, 'Cache deleted');
});

test('Returns 401 if access token malformed', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('purge=cache')
    .set('Authorization', 'Bearer invalid');
  t.is(response.status, 401);
  t.is(response.body.error, 'unauthorized');
});

test('Returns 401 if access token doesn’t provide sufficient scope', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('purge=cache')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN_NOT_SCOPED}`);
  t.is(response.status, 401);
  t.is(response.body.error, 'insufficient_scope');
});

test('Returns 404 if query unknown', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('foo=bar')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 404);
  t.is(response.body.error, 'not_found');
});

test('Returns 404 if no query provided', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('Authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 404);
  t.is(response.body.error, 'not_found');
});
