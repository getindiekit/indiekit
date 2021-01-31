import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import test from 'ava';
import nock from 'nock';
import {server} from '@indiekit-test/server';

test('Creates post (JSON)', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create'
    });
  nock('https://api.github.com')
    .put(uri => uri.includes('foobar'))
    .reply(200, {commit: {message: 'Message'}});
  const request = await server;

  const result = await request.post('/micropub')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`)
    .send({
      type: ['h-entry'],
      properties: {
        name: ['Foobar'],
        content: ['Micropub test of creating an h-entry with a JSON request containing multiple categories.'],
        photo: [{
          value: 'https://website.example/photo.jpg',
          alt: 'Example photo'
        }],
        category: ['test1', 'test2']
      }
    });

  t.is(result.statusCode, 202);
  t.regex(result.headers.location, /\bfoobar\b/);
  t.regex(result.body.success_description, /\bPost will be created\b/);
});
