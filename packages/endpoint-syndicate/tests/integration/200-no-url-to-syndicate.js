import test from 'ava';
import {server} from '@indiekit-test/server';

test('Returns 200 if URL not awaiting', async t => {
  const request = await server;

  const result = await request.post('/syndicate')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`)
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`);

  t.is(result.statusCode, 200);
  t.is(result.body.success_description, `No post record available for ${process.env.TEST_PUBLICATION_URL}notes/foobar/`);
});
