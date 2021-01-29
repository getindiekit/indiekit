import test from 'ava';
import {MediaEndpoint} from '../index.js';

test('Gets mountpath', t => {
  const result = new MediaEndpoint();
  t.is(result.mountpath, '/media');
});
