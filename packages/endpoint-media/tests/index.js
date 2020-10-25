import test from 'ava';
import {MediaEndpoint} from '../index.js';

test('Gets namespace', t => {
  const result = new MediaEndpoint();
  t.is(result.namespace, 'endpoint-media');
});
