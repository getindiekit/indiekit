import test from 'ava';
import {ShareEndpoint} from '../index.js';

const endpoint = new ShareEndpoint();

test('Gets endpoint’s namespace', t => {
  t.is(endpoint.namespace, 'endpoint-share');
});
