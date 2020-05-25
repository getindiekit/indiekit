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

test.serial('Gets a value', async t => {
  await t.context.applicationModel.set('name', 'foobar1');
  const result = await t.context.applicationModel.get('name');
  t.is(result, 'foobar1');
});

test.serial('Gets all values', async t => {
  await t.context.applicationModel.set('name', 'foobar2');
  const result = await t.context.applicationModel.getAll();
  t.is(result.name, 'foobar2');
});

test.serial('Sets a value', async t => {
  await t.context.applicationModel.set('name', 'foobar3');
  const result = await t.context.applicationModel.get('name');
  t.is(result, 'foobar3');
});

test.serial('Sets all values', async t => {
  await t.context.applicationModel.setAll({
    name: 'foobar4',
    locale: 'bazqux1'
  });
  const result = await t.context.applicationModel.getAll();
  t.is(result.name, 'foobar4');
  t.is(result.locale, 'bazqux1');
});
