import test from 'ava';
import {formEncodedToMf2} from '../../services/transform-request.js';

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
