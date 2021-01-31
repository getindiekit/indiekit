import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {server} from '@indiekit-test/server';

test('Returns list of previously published posts', async t => {
  nock('https://website.example')
    .get('/page.html')
    .reply(200, getFixture('html/page.html'));
  const request = await server;

  const result = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=source&properties[]=name&url=https://website.example/page.html');

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, 'Source has no items');
});
