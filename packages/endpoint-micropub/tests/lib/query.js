import test from 'ava';
import {JekyllPreset} from '../../../preset-jekyll/index.js';
import {getConfig, queryList} from '../../lib/query.js';

test.beforeEach(t => {
  t.context = {
    list: ['blog', 'indieweb', 'microblog', 'web', 'website'],
    url: 'https://website.example'
  };
});

test('Returns queryable config', t => {
  const application = {
    url: 'https://endpoint.example'
  };
  const publication = {
    categories: ['foo', 'bar'],
    postTypes: new JekyllPreset().postTypes,
    syndicationTargets: []
  };
  const result = getConfig(application, publication);
  t.truthy(result.categories);
  t.falsy(result['post-types'][0].path);
});

test('Filters a list', t => {
  const result = queryList(t.context.list, {filter: 'web'});
  t.deepEqual(result, ['indieweb', 'web', 'website']);
});

test('Limits a list', t => {
  const result = queryList(t.context.list, {limit: 1});
  t.deepEqual(result, ['blog']);
});

test('Limits a list with an offset', t => {
  const result = queryList(t.context.list, {limit: 1, offset: 2});
  t.deepEqual(result, ['microblog']);
});

test('Filters and limits a list', t => {
  const result = queryList(t.context.list, {filter: 'web', limit: 1});
  t.deepEqual(result, ['indieweb']);
});

test('Filters and limits a list with an offset', t => {
  const result = queryList(t.context.list, {filter: 'web', limit: 1, offset: 2});
  t.deepEqual(result, ['website']);
});
