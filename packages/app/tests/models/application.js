import test from 'ava';

import {client} from '../../config/db.js';
import * as applicationModel from '../../models/application.js';

test.afterEach(() => {
  client.flushall();
});

test('Gets a value', async t => {
  await applicationModel.set('foo', 'bar');
  const result = await applicationModel.get('foo');
  t.is(result, 'bar');
});

test('Gets all values', async t => {
  await applicationModel.set('foo', 'bar');
  const result = await applicationModel.getAll();
  t.is(result.foo, 'bar');
});

test('Sets a value', async t => {
  await applicationModel.set('foo', 'bar');
  const result = await applicationModel.get('foo');

  t.is(result, 'bar');
});

test('Sets all values', async t => {
  await applicationModel.setAll({
    foo: 'bar',
    baz: 'qux'
  });
  const result = await applicationModel.getAll();
  t.is(result.foo, 'bar');
  t.is(result.baz, 'qux');
});
