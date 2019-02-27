const test = require('ava');
const app = require('./test-server');

test('The application should serve a favicon', async t => {
  const response = await app.get('/favicon.ico');

  t.is(response.status, 200);
  t.regex(response.header['content-type'], /^image/);
});

// The application index should show an HTML page
// The application should responsd to 404’s with an HTML page
