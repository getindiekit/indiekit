import test from 'ava';
import {SyndicateEndpoint} from '../index.js';

test('Gets mountpath', t => {
  const result = new SyndicateEndpoint();

  t.is(result.mountpath, '/syndicate');
});
