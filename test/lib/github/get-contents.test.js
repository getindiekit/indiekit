const nock = require('nock');
const test = require('ava');

const github = require(process.env.PWD + '/lib/github');

test('Reads content of a file in a repository', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b',
      type: 'file',
      name: 'foo.txt',
      path: 'bar/foo.txt'
    });

  // Setup
  const path = 'bar/foo.txt';
  const response = await github.getContents(path);

  t.is(response.status, 200);
  t.is(response.data.name, 'foo.txt');
  scope.done();
});

test('Throws error if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  // Setup
  const path = 'bar/foo.txt';
  const error = await t.throwsAsync(async () => {
    await github.getContents(path);
  });

  // Test assertions
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});
