import test from 'ava';
import {client} from '../../config/database.js';
import * as githubController from '../../controllers/github.js';

test.afterEach.always(() => {
  client.flushall();
});

test('Reads GitHub setting', async t => {
  const result = await githubController.read();
  t.is(result.branch, 'master');
});

test.serial('Writes GitHub setting', async t => {
  const result = await githubController.write({key6: 'foobar'});
  t.is(result, true);
});

test('Throws error writing GitHub setting with no values', async t => {
  const error = await t.throwsAsync(githubController.write());
  t.regex(error.message, /\bwrong number of arguments\b/);
});
