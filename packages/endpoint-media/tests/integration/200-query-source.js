import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns list of previously uploaded files', async t => {
  const request = await testServer();

  const result = await request.get('/media')
    .set('Accept', 'application/json')
    .query('q=source');

  t.truthy(result.body.items);
});
