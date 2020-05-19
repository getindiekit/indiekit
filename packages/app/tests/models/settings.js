import test from 'ava';

import {client} from '../../config/db.js';
import * as settingsModel from '../../models/settings.js';

test.afterEach(() => {
  client.flushall();
});

test('Gets a value', async t => {
  await settingsModel.set('name', 'Foobar');
  const result = await settingsModel.get('name');
  t.is(result, 'Foobar');
});

test('Gets all values', async t => {
  await settingsModel.set('name', 'Foobar');
  const result = await settingsModel.getAll();
  t.is(result.name, 'Foobar');
});

test('Sets a value', async t => {
  await settingsModel.set('name', 'Foobar');
  const result = await settingsModel.get('name');

  t.is(result, 'Foobar');
});

test('Sets all values', async t => {
  await settingsModel.setAll({
    name: 'Foobar',
    color: '#f00'
  });
  const result = await settingsModel.getAll();
  t.is(result.name, 'Foobar');
  t.is(result.color, '#f00');
});
