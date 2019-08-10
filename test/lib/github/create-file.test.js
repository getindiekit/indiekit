const nock = require('nock');
const test = require('ava');

const config = require(process.env.PWD + '/app/config');
const github = require(process.env.PWD + '/app/lib/github');

test('Creates a new file in a repository', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('foo.txt'))
    .reply(200, {
      content: {
        type: 'file',
        name: 'foo.txt',
        path: 'bar/foo.txt',
        url: 'https://api.github.com/repos/username/repo/contents/bar/foo.txt'
      },
      commit: {
        message: `Create message\nwith ${config.name}`
      }
    });

  // Setup
  const path = 'bar/foo.txt';
  const content = 'foo';
  const options = {
    message: 'Create message'
  };

  // Test assertions
  const response = await github.createFile(path, content, options);
  t.truthy(response);
  t.is(response.data.commit.message, `Create message\nwith ${config.name}`);

  scope.done();
});

test('Throws an error when GitHub returns a 404', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('foo.txt'))
    .reply(404, {
      message: 'Not found'
    });

  // Setup
  const path = 'bar/foo.txt';
  const content = 'foo';
  const options = {
    message: 'Create message'
  };

  // Test assertions
  const error = await t.throwsAsync(github.createFile(path, content, options));
  t.is(error.message.status, 404);
  t.is(error.message.error_description, 'Not found');

  scope.done();
});
