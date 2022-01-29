import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {testServer} from '@indiekit-test/server';

test('Login returns 401 if can’t find authorization endpoint', async t => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get('/')
    .reply(200, getFixture('html/page.html'));

  const request = await testServer();

  const result = await request.post('/session/login');

  t.true(result.text.includes('No authorization endpoint found'));
  t.is(result.statusCode, 401);
});
