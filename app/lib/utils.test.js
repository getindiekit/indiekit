const test = require('ava');

const utils = require('./utils');

// Tests
test('Capitalizes first letter of a string', t => {
  t.is(utils.capitalizeFirstLetter('foo bar'), 'Foo bar');
  t.is(utils.capitalizeFirstLetter('foo-bar'), 'Foo-bar');
});

test('Decodes form-encoded string', t => {
  t.false(utils.decodeFormEncodedString({foo: 'bar'}));
  t.is(utils.decodeFormEncodedString('foo+bar'), 'foo bar');
  t.is(utils.decodeFormEncodedString('http%3A%2F%2Ffoo.bar'), 'http://foo.bar');
});

test('Removes empty keys from an object', t => {
  const objectWithChildren = {foo: 'bar', baz: {qux: {quux: 'quuz'}}};
  const objectWithEmptyChildren = {foo: 'bar', baz: {}, qux: {quux: {}}};

  t.deepEqual(utils.removeEmptyObjectKeys(objectWithChildren), {foo: 'bar', baz: {qux: {quux: 'quuz'}}});
  t.deepEqual(utils.removeEmptyObjectKeys(objectWithEmptyChildren), {foo: 'bar'});
});

test('Removes `/` from beginning and end of string', t => {
  t.is(utils.normalizePath('/foo/bar/'), 'foo/bar');
});
