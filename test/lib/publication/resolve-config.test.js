const nock = require('nock');
const test = require('ava');

const resolveConfig = require(process.env.PWD + '/app/lib/publication/resolve-config.js');

test.before(t => {
  t.context.defaults = require(process.env.PWD + '/app/lib/publication/defaults');
});

test('Returns defaults if no configuration path provided', async t => {
  const result = await resolveConfig(null, t.context.defaults);
  t.deepEqual(result, t.context.defaults);
});

test('Throws error if configuration path not found', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.json'))
    .reply(404, {
      message: 'Not found'
    });

  const error = await t.throwsAsync(resolveConfig('foo.json', t.context.defaults));
  t.is(error.message.error_description, 'Not found');
  scope.done();
});
