import test from 'ava';
import {ShareEndpoint} from '../index.js';

test('Gets mountpath', t => {
  const result = new ShareEndpoint();

  t.is(result.mountpath, '/share');
});
