import test from 'ava';
import {client} from '../../config/database.js';
import * as gitlabController from '../../controllers/gitlab.js';

test.afterEach.always(() => {
  client.flushall();
});

test('Reads GitLab setting', async t => {
  const result = await gitlabController.read();
  t.is(result.branch, 'master');
});

test.serial('Writes GitLab setting', async t => {
  const result = await gitlabController.write({key6: 'foobar'});
  t.is(result, true);
});

test('Throws error writing GitLab setting with no values', async t => {
  const error = await t.throwsAsync(gitlabController.write());
  t.regex(error.message, /\bwrong number of arguments\b/);
});
