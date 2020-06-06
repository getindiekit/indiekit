import test from 'ava';
import fixture from '../helpers/fixture.js';
import mergeConfigsService from '../../services/merge-configs.js';
import defaultConfig from '@indiekit/config-jekyll';

test('Merges values from custom and default configurations', t => {
  const customConfig = JSON.parse(fixture('custom-config.json'));
  const result = mergeConfigsService(customConfig, defaultConfig);
  t.is(result['syndicate-to'][0].name, '@username on Twitter');
  t.is(result['slug-separator'], '_');
  t.is(result['post-types'][0].name, 'Journal entry');
});
