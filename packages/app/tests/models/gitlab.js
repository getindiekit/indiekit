import test from 'ava';
import {rewiremock} from '../helpers/rewiremock.js';
import {client} from '../../config/database.js';

test.beforeEach(async t => {
  t.context.gitlabModel = await rewiremock.proxy(() => {
    return import('../../models/gitlab.js');
  });
});

test.afterEach.always(() => {
  client.flushall();
});

test('Gets a value', async t => {
  await t.context.gitlabModel.set('key1', 'foobar');
  const result = await t.context.gitlabModel.get('key1');
  t.is(result, 'foobar');
});

test('Gets all values', async t => {
  await t.context.gitlabModel.set('key2', 'foobar');
  const result = await t.context.gitlabModel.getAll();
  t.is(result.key2, 'foobar');
});

test('Sets a value', async t => {
  await t.context.gitlabModel.set('key3', 'foobar');
  const result = await t.context.gitlabModel.get('key3');
  t.is(result, 'foobar');
});

test('Sets all values', async t => {
  await t.context.gitlabModel.setAll({
    key4: 'foobar',
    key5: 'bazqux'
  });
  const result = await t.context.gitlabModel.getAll();
  t.is(result.key4, 'foobar');
  t.is(result.key5, 'bazqux');
});
