import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns list of previously published posts', async t => {
  const request = await testServer();

  const result = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=source');

  t.truthy(result.body.items);
});
