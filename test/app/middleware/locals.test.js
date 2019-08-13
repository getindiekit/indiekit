require('dotenv').config();

const nock = require('nock');
const test = require('ava');

test.skip('Application saves publication config to locals', async t => {
  // Mock request
  const pubConfig = JSON.stringify({
    categories: ['foo', 'bar']
  });
  const content = Buffer.from(pubConfig).toString('base64');
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.json'))
    .reply(200, {
      content
    });

  // Setup
  const {app} = t.context;
  const response = await app.get('/micropub')
    .set('Accept', 'application/json')
    .query({q: 'config'});

  // Test assertions
  t.is(response.status, 200);
  t.deepEqual(response.body.categories, ['foo', 'bar']);
  scope.done();
});
