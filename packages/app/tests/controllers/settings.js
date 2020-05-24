import test from 'ava';

import {client} from '../../config/db.js';
import * as settings from '../../controllers/settings.js';

test.afterEach(() => {
  client.flushall();
});

test('Reads a setting', async t => {
  const result = await settings.read();
  t.is(result.name, 'IndieKit');
});

test('Writes a setting', async t => {
  const result = await settings.write({
    locale: 'de'
  });
  t.is(result, true);
});

test('Throws error writing setting with no values', async t => {
  const error = await t.throwsAsync(settings.write());
  t.regex(error.message, /\bwrong number of arguments\b/);
});
