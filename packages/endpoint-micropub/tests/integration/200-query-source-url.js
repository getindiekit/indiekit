import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {testServer} from '@indiekit-test/server';

test('Returns list of previously published posts', async t => {
  nock('https://website.example')
    .get('/post.html')
    .reply(200, getFixture('html/post.html'));
  const request = await testServer();

  const result = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=source&properties[]=name&url=https://website.example/post.html');

  t.deepEqual(result.body, {
    properties: {
      name: ['I ate a cheese sandwich, which was nice.'],
    },
  });
});
