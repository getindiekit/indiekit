import test from 'ava';
import {SyndicateEndpoint} from '../index.js';

test('Gets namespace', t => {
  const result = new SyndicateEndpoint();
  t.is(result.namespace, 'endpoint-syndicate');
});
