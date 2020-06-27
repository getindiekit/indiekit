import test from 'ava';
import {JekyllConfig} from '../../../config-jekyll/index.js';
import {
  getPostTypeConfig,
  randomString
} from '../../lib/utils.js';

test.beforeEach(t => {
  t.context.config = new JekyllConfig().config;
});

test('Get post type configuration for a given type', t => {
  const result = getPostTypeConfig('note', t.context.config);
  t.is(result.name, 'Note');
});

test('Generates random alpha-numeric string, 5 characters long', t => {
  const result = randomString();
  t.regex(result, /[\d\w]{5}/g);
});
