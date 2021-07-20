import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';

test('Returns 400 if source URL can’t be found', async t => {
  nock('https://website.example')
    .get('/post.html')
    .replyWithError('Not found');
  const request = await server();

  const result = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=source&properties[]=name&url=https://website.example/post.html');

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, 'Not found');
});
