const nock = require('nock');
const test = require('ava');

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/lib/github');

test('Updates a file in a repository', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b',
      name: 'foo.txt',
      path: 'bar/foo.txt'
    })
    .put(uri => uri.includes('foo.txt'))
    .reply(200, {
      commit: {
        message: `Update message\nwith ${config.name}`
      }
    });

  // Setup
  const response = await github.updateFile('foo.txt', 'foo', {
    message: 'Update message'
  });

  // Test assertions
  t.is(response.status, 200);
  t.is(response.data.commit.message, `Update message\nwith ${config.name}`);
  scope.done();
});

test('Creates a file if original file not found', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('not found')
    .put(uri => uri.includes('foo.txt'))
    .reply(200, {
      commit: {
        message: `Update message\nwith ${config.name}`
      }
    });

  // Setup
  const response = await github.updateFile('foo.txt', 'foo', {
    message: 'Update message'
  });

  // Test assertions
  t.is(response.status, 200);
  t.is(response.data.commit.message, `Update message\nwith ${config.name}`);
  scope.done();
});

test('Throws error if GitHub can’t update file', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('foo.txt'))
    .replyWithError('unknown error');

  // Setup
  const error = await t.throwsAsync(github.updateFile('foo.txt', 'foo', {
    message: 'Update message'
  }));

  // Test assertions
  t.regex(error.message.error_description, /\bunknown error\b/);
  scope.done();
});
