import test from 'ava';

import {templatesPath} from '../index.js';

test('Returns templates directory', t => {
  const result = templatesPath;

  t.regex(result, /\btemplates-yaml\/templates\b/);
});
