const test = require('ava');
const nock = require('nock');
const request = require('supertest');

const config = require(process.env.PWD + '/app/config');
const store = require(process.env.PWD + '/lib/store');
const outputDir = process.env.PWD + '/.ava_output/micropub-action-undelete-error';

test.beforeEach(t => {
  config.data.dir = outputDir;
  t.context.app = request(require(process.env.PWD + '/app/server'));
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Throws error undeleting if GitHub responds with an error', async t => {
  // Mock GitHub create file request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('baz.md'))
    .replyWithError('not found');

  // Setup
  store.set('https://foo.bar/baz.md', {
    post: {
      type: 'note',
      path: 'baz.md'
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        content: ['Baz']
      },
      slug: ['baz']
    }
  });
  const {app} = t.context;
  const response = await app.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${t.context.token}`)
    .query({
      action: 'undelete',
      url: 'https://foo.bar/baz.md'
    });

  // Test assertions
  t.is(response.status, 500);
  t.is(response.body.error, 'error');
  t.regex(response.body.error_description, /\bnot found\b/);
  scope.done();
});
