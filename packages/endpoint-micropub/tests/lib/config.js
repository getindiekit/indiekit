import test from 'ava';
import {JekyllPreset} from '../../../preset-jekyll/index.js';
import {getConfig} from '../../lib/config.js';

test.beforeEach(t => {
  t.context.url = 'https://website.example';
});

test('Returns queryable publication config', async t => {
  const {config} = new JekyllPreset();
  const result = await getConfig(config);
  t.truthy(result.categories);
  t.falsy(result['slug-separator']);
  t.falsy(result['post-types'][0].path);
});
