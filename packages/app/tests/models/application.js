import test from 'ava';
import {rewiremock} from '../helpers/rewiremock.js';
import {client} from '../../config/database.js';

test.beforeEach(async t => {
  t.context.applicationModel = await rewiremock.proxy(() => {
    return import('../../models/application.js');
  });
});

test.afterEach.always(() => {
  client.flushall();
});

test('Gets a value', async t => {
  await t.context.applicationModel.set('key1', 'foobar');
  const result = await t.context.applicationModel.get('key1');
  t.is(result, 'foobar');
});

test('Gets all values', async t => {
  await t.context.applicationModel.set('key2', 'foobar');
  const result = await t.context.applicationModel.getAll();
  t.is(result.key2, 'foobar');
});

test('Sets a value', async t => {
  await t.context.applicationModel.set('key3', 'foobar');
  const result = await t.context.applicationModel.get('key3');
  t.is(result, 'foobar');
});

test('Sets all values', async t => {
  await t.context.applicationModel.setAll({
    key4: 'foobar',
    key5: 'bazqux'
  });
  const result = await t.context.applicationModel.getAll();
  t.is(result.key4, 'foobar');
  t.is(result.key5, 'bazqux');
});
