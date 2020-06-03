import test from 'ava';
import action from '../../services/action.js';

test.beforeEach(t => {
  t.context.url = 'https://website.example';
});

test('Returns a delete action', t => {
  const result = action('delete', 'delete', t.context.url);
  t.is(result, 'delete');
});

test('Returns a undelete action', t => {
  const result = action('create', 'undelete', t.context.url);
  t.is(result, 'undelete');
});

test('Returns an update action', t => {
  const result = action('update', 'update', t.context.url);
  t.is(result, 'update');
});

test('Returns a create action', t => {
  const result = action('create', 'create');
  t.is(result, 'create');
});

test('Throws error if URL provided but no action', t => {
  const error = t.throws(() => action('delete', undefined, t.context.url));
  t.is(error.message, `Need an action to perform on ${t.context.url}`);
});

test('Throws error if action provided but no URL', t => {
  const error = t.throws(() => action('delete', 'delete'));
  t.is(error.message, 'URL required to perform delete action');
});
