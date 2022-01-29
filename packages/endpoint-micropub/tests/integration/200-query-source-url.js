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
    .get('/post.html')
    .reply(200, getFixture('html/post.html'));
  const request = await testServer();

  const result = await request.get('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query('q=source&properties[]=name&url=https://website.example/post.html');

  t.deepEqual(result.body, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.'],
    },
  });
});
