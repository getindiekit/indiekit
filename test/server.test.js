const test = require('ava');
const request = require('supertest');

const app = request(require(process.env.PWD + '/app/server'));

test('Application serves a favicon', async t => {
  const response = await app.get('/favicon.ico');

  t.is(response.status, 200);
  t.regex(response.header['content-type'], /^image/);
});

test('Application displays a home page', async t => {
  const response = await app.get('/');

  t.is(response.status, 200);
  t.regex(response.header['content-type'], /^text\/html/);
});

test('Application responds to 404 errors', async t => {
  const response = await app.get('/foobar');

  t.is(response.status, 404);
  t.regex(response.header['content-type'], /^text\/html/);
});
