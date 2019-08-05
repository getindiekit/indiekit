const nock = require('nock');
const test = require('ava');

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');

test('Deletes a file in a GitHub repository', async t => {
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
    .delete(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: null,
      commit: {
        message: `Delete message\nwith ${config.name}`
      }
    });

  // Setup
  const path = 'bar/foo.txt';
  const options = {
    message: 'Delete message'
  };

  // Execute function
  const response = await github.deleteFile(path, options);
  t.truthy(response);
  t.is(response.data.commit.message, `Delete message\nwith ${config.name}`);
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
  const options = {
    message: 'Delete message'
  };

  // Test assertions
  const error = await t.throwsAsync(github.deleteFile(path, options));
  t.is(error.message, 'Not found');

  scope.done();
});

test('Throws an error if no SHA found for file', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: 'Zm9vYmFy',
      type: 'file'
    });

  // Setup
  const path = 'bar/foo.txt';
  const options = {
    message: 'Delete message'
  };

  // Test assertions
  const error = await t.throwsAsync(github.deleteFile(path, options));
  t.is(error.message, `No SHA found for ${path}`);

  scope.done();
});
