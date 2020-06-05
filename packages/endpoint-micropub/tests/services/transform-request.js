import test from 'ava';
import {decodeQueryParameter, formEncodedToMf2} from '../../services/transform-request.js';

test('Decodes form-encoded query parameter', t => {
  const result = decodeQueryParameter('https%3A%2F%2Ffoo.bar');
  t.is(result, 'https://foo.bar');
});

test('Parses Microformats in form-encoded request', t => {
  const result = formEncodedToMf2({
    h: 'entry',
    content: 'I+ate+a+cheese+sandwich.'
  });
  t.deepEqual(result, {
    type: ['h-entry'],
    properties: {
      content: ['I ate a cheese sandwich.']
    }
  });
});
