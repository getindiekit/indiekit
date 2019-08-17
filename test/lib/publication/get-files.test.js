const test = require('ava');
const nock = require('nock');

const getFiles = require(process.env.PWD + '/lib/publication/get-files.js');

test('Throws error if file can’t be fetched from GitHub', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('not found');

  // Setup
  const error = await t.throwsAsync(async () => {
    await getFiles('foo.txt');
  });

  // Test assertions
  t.is(error.message.error_description, 'foo.txt could not be found in the cache or at the specified remote location');
  scope.done();
});
