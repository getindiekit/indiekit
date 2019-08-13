const fs = require('fs-extra');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');
const pub = require('./fixtures/create-config');

const outputDir = process.env.PWD + '/.ava_output/post-undelete';

test.before(() => {
  config.data.dir = outputDir;
});

test('Undeletes a post', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  const postData = {
    location: 'https://foo.bar/baz',
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
  };
  const response = await post.undelete(pub, postData);

  // Test assertions
  t.truthy(validUrl.isUri(response));
  scope.done();
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
