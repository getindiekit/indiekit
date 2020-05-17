import test from 'ava';

import templates from '../index.js';

test('Returns templates directory', t => {
  const result = templates;

  t.regex(result, /\btemplates-yaml\/templates\b/);
});
