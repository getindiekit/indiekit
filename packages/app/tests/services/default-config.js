import test from 'ava';

import defaultConfigService from '../../services/default-config.js';

test('Returns configuration object for Jekyll', async t => {
  const result = await defaultConfigService('jekyll');
  t.regex(result['post-types'].article.post.path, /^_posts/);
});
