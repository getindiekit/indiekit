import test from 'ava';
import {MicropubEndpoint} from '../index.js';

test('Gets namespace', t => {
  const result = new MicropubEndpoint();
  t.is(result.namespace, 'endpoint-micropub');
});
