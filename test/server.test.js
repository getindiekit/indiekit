const test = require('ava');
const request = require('supertest');

const app = request(require(process.env.PWD + '/app/server'));

test('Application serves a favicon', async t => {
  const response = await app.get('/favicon.ico');

  t.is(response.status, 200);
  t.regex(response.header['content-type'], /^image/);
});

test.todo('Application displays an home page');

test.todo('Application responds to 404’s errors');
