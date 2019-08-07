require('dotenv').config();

const test = require('ava');
const request = require('supertest');

test.before(t => {
  t.context.app = request(require(process.env.PWD + '/app/server'));
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Returns a 201 if `purge` value in query deletes cache', async t => {
  const {app} = t.context;
  const response = await app.post('/admin')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({purge: 'cache'});
  t.is(response.status, 201);
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
