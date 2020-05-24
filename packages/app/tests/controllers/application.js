import test from 'ava';

import {client} from '../../config/db.js';
import * as applicationController from '../../controllers/application.js';

test.afterEach(() => {
  client.flushall();
});

test('Reads an application setting', async t => {
  const result = await applicationController.read();
  t.is(result.name, 'IndieKit');
});

test('Writes an application setting', async t => {
  const result = await applicationController.write({
    locale: 'de'
  });
  t.is(result, true);
});

test('Throws error writing setting with no values', async t => {
  const error = await t.throwsAsync(applicationController.write());
  t.regex(error.message, /\bwrong number of arguments\b/);
});
