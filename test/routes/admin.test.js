const request = require('supertest');
const test = require('ava');

// Tests
test.before(t => {
  t.context.app = request(require(process.env.PWD + '/app/server'));
});

test('Purges cache', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('purge=cache')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 200);
  t.is(response.body.success_description, 'Success');
});

test('Returns 401 if access token malformed', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('purge=cache')
    .set('authorization', 'Bearer Invalid');
  t.is(response.status, 401);
  t.is(response.body.error, 'unauthorized');
});

test('Returns 401 if access token doesn’t provide sufficient scope', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('purge=cache')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN_NOT_SCOPED}`);
  t.is(response.status, 401);
  t.is(response.body.error, 'insufficient_scope');
});

test('Returns 404 if query unknown', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .query('foo=bar')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 404);
  t.is(response.body.error, 'not_found');
});

test('Returns 404 if no query provided', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 404);
  t.is(response.body.error, 'not_found');
});
