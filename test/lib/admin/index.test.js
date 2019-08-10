require('dotenv').config();

const test = require('ava');
const request = require('supertest');

test.before(t => {
  t.context.app = request(require(process.env.PWD + '/app/server'));
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Flushes cache', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({cache: 'flush'});
  t.is(response.status, 200);
  t.is(response.body.success_description, 'Cache flushed');
});

test('Returns list of cache keys', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({cache: 'keys'});
  t.is(response.status, 200);
  t.truthy(response.body);
});

test('Returns cache statistics', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({cache: 'stats'});
  t.is(response.status, 200);
  t.true(response.body.hits >= 0);
});

test('Returns a 400 if no query provided', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('Authorization', `Bearer ${t.context.token}`);
  t.is(response.status, 400);
});

test('Returns a 400 if unrecognised query provided', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({purge: 'unknown'});
  t.is(response.status, 400);
});
