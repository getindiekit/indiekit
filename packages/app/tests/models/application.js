import test from 'ava';

import {client} from '../../config/db.js';
import * as applicationModel from '../../models/application.js';

test.afterEach(() => {
  client.flushall();
});

test('Gets a value', async t => {
  await applicationModel.set('foo', 'app-bar');
  const result = await applicationModel.get('foo');
  t.is(result, 'app-bar');
});

test('Gets all values', async t => {
  await applicationModel.set('foo', 'app-bar');
  const result = await applicationModel.getAll();
  t.is(result.foo, 'app-bar');
});

test('Sets a value', async t => {
  await applicationModel.set('foo', 'app-bar');
  const result = await applicationModel.get('foo');

  t.is(result, 'app-bar');
});

test('Sets all values', async t => {
  await applicationModel.setAll({
    foo: 'app-bar',
    baz: 'qux'
  });
  const result = await applicationModel.getAll();
  t.is(result.foo, 'app-bar');
  t.is(result.baz, 'qux');
});
