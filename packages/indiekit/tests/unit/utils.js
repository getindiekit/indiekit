import test from 'ava';
import {isUrl} from '../../lib/utils.js';

test('Checks if given string is a valid URL', t => {
  t.false(isUrl('foo.bar'));
  t.true(isUrl('https://foo.bar'));
});

test('Throws error if given URL is not a string', t => {
  t.throws(() => {
    isUrl({url: 'https://foo.bar'});
  }, {
    instanceOf: TypeError,
    message: 'Expected a string'
  });
});
