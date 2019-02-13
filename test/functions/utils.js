const test = require('ava');
const utils = require('../../app/functions/utils');

test('Decode plus-separated string', t => {
  const string = 'foo+bar';
  t.is(utils.decodeFormEncodedString(string), 'foo bar');
});

test('Decode URL-encoded string', t => {
  const string = 'https%3A%2F%2Fmicropub.rocks';
  t.is(utils.decodeFormEncodedString(string), 'https://micropub.rocks');
});

test('Remove empty keys from object', t => {
  const object = {
    foo: 'bar',
    baz: {},
    qux: {
      quux: {}
    }
  };

  t.deepEqual(utils.removeEmptyObjectKeys(object), {foo: 'bar'});
});
