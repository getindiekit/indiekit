const nock = require('nock');
const test = require('ava');

const github = require(process.env.PWD + '/app/lib/github');

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

test('Throws an error when GitHub returns a 404', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .reply(404, {
      message: 'Not found'
    });

  // Setup
  const path = 'bar/foo.txt';

  // Test assertions
  await t.throwsAsync(async () => {
    await github.getContents(path);
  }, {message: 'Not found'});

  scope.done();
});
