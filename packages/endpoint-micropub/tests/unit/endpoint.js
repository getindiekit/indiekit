import test from 'ava';
import {MicropubEndpoint} from '../../index.js';

test('Gets mountpath', t => {
  const result = new MicropubEndpoint();

  t.is(result.mountpath, '/micropub');
});
