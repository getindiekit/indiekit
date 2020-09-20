import test from 'ava';
import {isUrl} from '../../lib/utils.js';

test('Checks if given string is a valid URL', t => {
  const invalidUrl = isUrl('foo.bar');
  const validUrl = isUrl('https://foo.bar');
  t.false(invalidUrl);
  t.true(validUrl);
});

test('Throws error if given URL is not a string', t => {
  const error = t.throws(() => {
    isUrl({url: 'https://foo.bar'});
  }, {instanceOf: TypeError});
  t.is(error.message, 'Expected a string');
});
