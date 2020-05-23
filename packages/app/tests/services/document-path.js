import test from 'ava';

import documentPathService from '../../services/document-path.js';

test('Returns file with extension', async t => {
  const result = await documentPathService('docs/en/settings', 'md');
  t.regex(result, /\bdocs\/en\/settings.md\b/);
});

test('Returns folder index', async t => {
  const result = await documentPathService('docs/en/', 'md');
  t.regex(result, /\bdocs\/en\/index.md\b/);
});
