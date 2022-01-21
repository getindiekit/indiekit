import process from 'node:process';
import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns 404 if can’t find previously uploaded file', async t => {
  const request = await testServer();

  const result = await request.get('/media/files/5ffcc8025c561a7bf53bd6e8')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'});

  t.is(result.statusCode, 404);
  t.true(result.text.includes('No file was found with this UUID'));
});
