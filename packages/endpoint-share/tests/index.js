import test from 'ava';
import {ShareEndpoint} from '../index.js';

test('Gets namespace', t => {
  const result = new ShareEndpoint();
  t.is(result.namespace, 'endpoint-share');
});
