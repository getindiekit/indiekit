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
      type: 'file',
      name: 'foo.txt',
      path: 'bar/foo.txt'
    })
    .put(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: {
        type: 'file',
        name: 'foo.txt',
        path: 'bar/foo.txt',
        url: 'https://api.github.com/repos/username/repo/contents/bar/foo.txt'
      },
      commit: {
        message: `Update message\nwith ${config.name}`
      }
    });

  // Setup
  const path = 'bar/foo.txt';
  const content = 'foo';
  const options = {
    message: 'Update message'
  };

  // Test assertions
  const response = await github.updateFile(path, content, options);
  t.truthy(response);
  t.is(response.data.commit.message, `Update message\nwith ${config.name}`);

  scope.done();
});

test('Throws error when GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('not found');

  // Setup
  const path = 'bar/foo.txt';
  const content = 'foo';
  const options = {
    message: 'Update message'
  };
  const error = await t.throwsAsync(github.updateFile(path, content, options));

  // Test assertions
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});

test('Throws error if GitHub can’t update file', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: 'Zm9vYmFy',
      type: 'file'
    })
    .put(uri => uri.includes('foo.txt'))
    .replyWithError('Can’t update file');

  // Setup
  const path = 'bar/foo.txt';
  const content = 'foo';
  const options = {
    message: 'Update message'
  };
  const error = await t.throwsAsync(github.updateFile(path, content, options));

  // Test assertions
  t.regex(error.message, /\bCan’t update file\b/);
  scope.done();
});
