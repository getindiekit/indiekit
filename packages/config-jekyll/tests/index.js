import test from 'ava';

import {JekyllConfig} from '../index.js';

test('Returns YAML post type template path', t => {
  const jekyllConfig = new JekyllConfig();
  const result = jekyllConfig.config['post-types'][0].template;

  t.regex(result, /\btemplates-yaml\/templates\/article.njk\b/);
});
