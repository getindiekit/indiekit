import test from 'ava';
import {client} from '../../config/database.js';
import * as applicationController from '../../controllers/application.js';

test.afterEach.always(() => {
  client.flushall();
});

test('Reads application setting', async t => {
  const result = await applicationController.read();
  t.is(result.name, 'IndieKit');
});

test.serial('Writes application setting', async t => {
  const result = await applicationController.write({key6: 'foobar'});
  t.is(result, true);
});

test('Throws error writing application setting with no values', async t => {
  const error = await t.throwsAsync(applicationController.write());
  t.regex(error.message, /\bwrong number of arguments\b/);
});
