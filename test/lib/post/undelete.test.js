const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');
const pub = require('./fixtures/create-config');

test.before(t => {
  config.data.dir = process.env.PWD + `/.ava_output/${test.meta.file}`;
  t.context.postData = {
    post: {
      type: 'note',
      path: '_notes/2019-08-17-baz.md',
      url: `${process.env.INDIEKIT_URL}/notes/2019/08/17/baz`
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        content: ['Baz']
      },
      slug: ['baz']
    }
  };
});

test('Undeletes a post', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  const undeleted = await post.undelete(pub, t.context.postData);

  // Test assertions
  t.truthy(validUrl.isUri(undeleted.post.url));
  scope.done();
});

test('Throws error if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('baz.md'))
    .replyWithError('not found');

  // Setup
  const error = await t.throwsAsync(post.undelete(pub, t.context.postData));

  // Test assertions
  t.regex(error.message.error_description, /\bnot found\b/);
  scope.done();
});
