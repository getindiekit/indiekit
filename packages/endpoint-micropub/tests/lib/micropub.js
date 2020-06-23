import test from 'ava';
import {JekyllConfig} from '../../../config-jekyll/index.js';
import {getAction, getConfig} from '../../lib/micropub.js';

test.beforeEach(t => {
  t.context.url = 'https://website.example';
});

test('Returns a delete action', t => {
  const result = getAction('delete', 'delete', t.context.url);
  t.is(result, 'delete');
});

test('Returns a undelete action', t => {
  const result = getAction('undelete', 'undelete', t.context.url);
  t.is(result, 'undelete');
});

test('Returns an update action', t => {
  const result = getAction('update', 'update', t.context.url);
  t.is(result, 'update');
});

test('Returns a create action', t => {
  const result = getAction('create', 'create');
  t.is(result, 'create');
});

test('Throws error if URL provided but no action', t => {
  const error = t.throws(() => getAction('delete', undefined, t.context.url));
  t.is(error.message, `Need an action to perform on ${t.context.url}`);
});

test('Throws error if action provided but no URL', t => {
  const error = t.throws(() => getAction('delete', 'delete'));
  t.is(error.message, 'URL required to perform delete action');
});

test('Returns queryable publication config', async t => {
  const {config} = new JekyllConfig();
  const result = await getConfig(config);
  t.truthy(result.categories);
  t.falsy(result['slug-separator']);
  t.falsy(result['post-types'][0].path);
});
