import test from 'ava';

import config from '../index.js';

test('Returns post type template path', t => {
  const result = config['post-types'][0].template;

  t.regex(result, /\btemplates-yaml\/templates\/article.njk\b/);
});
