const test = require('ava');

const post = require(process.env.PWD + '/app/lib/post');

test('Throws error', t => {
  // Setup
  const recordData = {
    post: {
      path: 'foo/bar.md'
    }
  };

  // Test assertions
  const error = t.throws(() => {
    post.update(recordData);
  });
  t.is(error.message.error, 'action_not_supported');
});
