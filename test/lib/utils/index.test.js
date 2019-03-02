const test = require('ava');

// Functions
const utils = require(process.env.PWD + '/app/lib/utils');

// Tests
test('Generates random alpha-numeric string, 5 characters long', t => {
  t.regex(utils.createRandomString(), /[\d\w]{5}/g);
});

test('Decodes form-encoded string', t => {
  t.false(utils.decodeFormEncodedString({foo: 'bar'}));
  t.is(utils.decodeFormEncodedString('foo+bar'), 'foo bar');
  t.is(utils.decodeFormEncodedString('http%3A%2F%2Ffoo.bar'), 'http://foo.bar');
});

test('Excerpts string', t => {
  const string = 'Foo bar baz qux quux.';
  t.is(utils.excerptString(string, 2), 'Foo bar');
  t.is(utils.excerptString(string, 10), 'Foo bar baz qux quux.');
});

test('Removes `/` from beginning and end of string', t => {
  t.is(utils.normalizePath('/foo/bar/'), 'foo/bar');
});
