import test from 'ava';
import {JekyllConfig} from '../../../config-jekyll/index.js';
import {getConfig} from '../../lib/micropub.js';

test.beforeEach(t => {
  t.context.url = 'https://website.example';
});

test('Returns queryable publication config', async t => {
  const {config} = new JekyllConfig();
  const result = await getConfig(config);
  t.truthy(result.categories);
  t.falsy(result['slug-separator']);
  t.falsy(result['post-types'][0].path);
});
