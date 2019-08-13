require('dotenv').config();

const test = require('ava');
const request = require('supertest');

test.beforeEach(t => {
  t.context.app = request(require(process.env.PWD + '/app/server'));
});

test('Application serves a favicon', async t => {
  const {app} = t.context;
  const response = await app.get('/favicon.ico');

  t.is(response.status, 200);
  t.regex(response.header['content-type'], /^image/);
});

test('Application displays a home page', async t => {
  const {app} = t.context;
  const response = await app.get('/');

  t.is(response.status, 200);
  t.regex(response.header['content-type'], /^text\/html/);
});

test('Application responds to 404 errors', async t => {
  const {app} = t.context;
  const response = await app.get('/foobar');

  t.is(response.status, 404);
  t.regex(response.header['content-type'], /^text\/html/);
});

test('Application responds to errors', async t => {
  const {app} = t.context;
  const response = await app.get('/teapot');

  t.is(response.status, 418);
  t.regex(response.header['content-type'], /^text\/html/);
});

test('Application responds to errors (using JSON if accepted)', async t => {
  const {app} = t.context;
  const response = await app.get('/teapot')
    .set('Accept', 'application/json');

  t.is(response.status, 418);
  t.regex(response.header['content-type'], /^application\/json/);
});
