import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 404 if can’t find previously uploaded file', async t => {
  const request = await server;

  const result = await request.get('/media/files/5ffcc8025c561a7bf53bd6e8');

  t.is(result.statusCode, 404);
  t.true(result.text.includes('No file was found with this UUID'));
});
