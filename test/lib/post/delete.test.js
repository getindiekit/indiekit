const nock = require('nock');
const test = require('ava');

const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');

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

test('Deletes a post', async t => {
  // Mock GitHub delete file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b'
    })
    .delete(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy',
      commit: {
        message: `Delete message\nwith ${config.name}`
      }
    });

  // Setup
  const response = await post.delete(t.context.postData);

  // Test assertions
  t.true(response);
  scope.done();
});
