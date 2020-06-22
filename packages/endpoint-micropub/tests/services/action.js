import test from 'ava';
import {deriveAction} from '../../services/action.js';

test.beforeEach(t => {
  t.context.url = 'https://website.example';
});

test('Returns a delete action', t => {
  const result = deriveAction('delete', 'delete', t.context.url);
  t.is(result, 'delete');
});

test('Returns a undelete action', t => {
  const result = deriveAction('undelete', 'undelete', t.context.url);
  t.is(result, 'undelete');
});

test('Returns an update action', t => {
  const result = deriveAction('update', 'update', t.context.url);
  t.is(result, 'update');
});

test('Returns a create action', t => {
  const result = deriveAction('create', 'create');
  t.is(result, 'create');
});

test('Throws error if URL provided but no action', t => {
  const error = t.throws(() => deriveAction('delete', undefined, t.context.url));
  t.is(error.message, `Need an action to perform on ${t.context.url}`);
});

test('Throws error if action provided but no URL', t => {
  const error = t.throws(() => deriveAction('delete', 'delete'));
  t.is(error.message, 'URL required to perform delete action');
});
