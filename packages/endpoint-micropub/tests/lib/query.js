import test from 'ava';
import {JekyllPreset} from '../../../preset-jekyll/index.js';
import {queryConfig, queryList} from '../../lib/query.js';

test.beforeEach(t => {
  t.context.url = 'https://website.example';
});

test('Returns queryable publication config', async t => {
  const {config} = new JekyllPreset();
  const result = await queryConfig(config);
  t.truthy(result.categories);
  t.falsy(result['post-types'][0].path);
});

test('Filters a list', t => {
  const list = ['blog', 'indieweb', 'microblog', 'web', 'website'];
  const result = queryList(list, {filter: 'web'});
  t.deepEqual(result, ['indieweb', 'web', 'website']);
});

test('Limits a list', t => {
  const list = ['blog', 'indieweb', 'microblog', 'web', 'website'];
  const result = queryList(list, {limit: 1});
  t.deepEqual(result, ['blog']);
});

test('Limits a list with an offset', t => {
  const list = ['blog', 'indieweb', 'microblog', 'web', 'website'];
  const result = queryList(list, {limit: 1, offset: 2});
  t.deepEqual(result, ['microblog']);
});

test('Filters and limits a list', t => {
  const list = ['blog', 'indieweb', 'microblog', 'web', 'website'];
  const result = queryList(list, {filter: 'web', limit: 1});
  t.deepEqual(result, ['indieweb']);
});

test('Filters and limits a list with an offset', t => {
  const list = ['blog', 'indieweb', 'microblog', 'web', 'website'];
  const result = queryList(list, {filter: 'web', limit: 1, offset: 2});
  t.deepEqual(result, ['website']);
});
