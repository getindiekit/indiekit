const request = require('supertest');
const test = require('ava');

const app = request(require(process.env.PWD + '/app/server'));

test('Deletes cache (with authorization header)', async t => {
  const response = await app.post('/admin')
    .query('purge=cache')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 200);
  t.is(response.body.success_description, 'Success');
});

test('Returns error from token endpoint if access token malformed', async t => {
  const response = await app.post('/admin')
    .send('purge=cache')
    .set('authorization', 'Bearer Invalid');
  t.is(response.status, 401);
  t.is(response.body.error_description, 'The token provided was malformed');
});

test('Returns 404 if query unknown', async t => {
  const response = await app.post('/admin')
    .send('foo=bar')
    .set('authorization', `Bearer ${process.env.TEST_INDIEAUTH_TOKEN}`);
  t.is(response.status, 404);
  t.is(response.body.error_description, 'Resource not found');
});
