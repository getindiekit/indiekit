import test from 'ava';

import * as publicationController from '../../controllers/publication.js';

test('Reads a publication setting', async t => {
  const result = await publicationController.read();
  t.is(result.defaultConfigType, 'jekyll');
});

test('Writes an application setting', async t => {
  const result = await publicationController.write({
    locale: 'de'
  });
  t.is(result, true);
});

test('Throws error writing setting with no values', async t => {
  const error = await t.throwsAsync(publicationController.write());
  t.regex(error.message, /\bwrong number of arguments\b/);
});
