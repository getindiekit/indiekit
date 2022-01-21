import process from 'node:process';
import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 500 if no database configured', async t => {
  // Create post
  const request = await server({hasDatabase: false});
  await request.post('/micropub')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .send('h=entry')
    .send('name=foobar')
    .send('mp-syndicate-to=https://twitter.com/username');

  // Syndicate post
  const result = await request.post('/syndicate')
    .auth(process.env.TEST_BEARER_TOKEN, {type: 'bearer'})
    .set('Accept', 'application/json')
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`);

  // Assertions
  t.is(result.statusCode, 500);
  t.regex(result.body.error_description, /This feature requires a database/);
});
