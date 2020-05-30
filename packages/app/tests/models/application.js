import test from 'ava';
import {mockClient} from '../helpers/database.js';
import {ApplicationModel} from '../../models/application.js';

const applicationModel = new ApplicationModel(mockClient);

test.afterEach.always(() => {
  mockClient.flushall();
});

test.serial('Gets a value', async t => {
  await applicationModel.set('name', 'foobar');
  const result = await applicationModel.get('name');
  t.is(result, 'foobar');
});

test.serial('Gets all values', async t => {
  await applicationModel.set('name', 'foobar');
  const result = await applicationModel.getAll();
  t.is(result.name, 'foobar');
});

test.serial('Sets a value', async t => {
  await applicationModel.set('name', 'foobar');
  const result = await applicationModel.get('name');
  t.is(result, 'foobar');
});

test.serial('Sets all values', async t => {
  await applicationModel.setAll({
    name: 'foobar',
    locale: 'bazqux'
  });
  const result = await applicationModel.getAll();
  t.is(result.name, 'foobar');
  t.is(result.locale, 'bazqux');
});
