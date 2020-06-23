import test from 'ava';

import {documentPath} from '../../lib/documentation.js';

test('Returns file with extension', async t => {
  const result = await documentPath('docs/en/settings', 'md');
  t.regex(result, /\bdocs\/en\/settings.md\b/);
});

test('Returns folder index', async t => {
  const result = await documentPath('docs/en/', 'md');
  t.regex(result, /\bdocs\/en\/index.md\b/);
});
