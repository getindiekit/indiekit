import test from 'ava';

import {client} from '../../config/db.js';
import * as settingsModel from '../../models/settings.js';

test.afterEach(() => {
  client.flushall();
});

test('Gets a value', async t => {
  await settingsModel.set('foo', 'bar');
  const result = await settingsModel.get('foo');
  t.is(result, 'bar');
});

test('Gets all values', async t => {
  await settingsModel.set('foo', 'bar');
  const result = await settingsModel.getAll();
  t.is(result.foo, 'bar');
});

test('Sets a value', async t => {
  await settingsModel.set('foo', 'bar');
  const result = await settingsModel.get('foo');

  t.is(result, 'bar');
});

test('Sets all values', async t => {
  await settingsModel.setAll({
    foo: 'bar',
    baz: 'qux'
  });
  const result = await settingsModel.getAll();
  t.is(result.foo, 'bar');
  t.is(result.baz, 'qux');
});
