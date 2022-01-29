import process from 'node:process';
import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {testServer} from '@indiekit-test/server';

test('Returns list of previously published posts', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create',
    });
  nock('https://website.example')
    .get('/page.html')
    .reply(200, getFixture('html/page.html'));
  const request = await testServer();

  const result = await request.get('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query('q=source&properties[]=name&url=https://website.example/page.html');

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, 'Source has no items');
});
