import test from 'ava';
import {rewiremock} from '../helpers/rewiremock.js';
import {client} from '../../config/database.js';

test.beforeEach(async t => {
  t.context.githubModel = await rewiremock.proxy(() => {
    return import('../../models/github.js');
  });
});

test.afterEach.always(() => {
  client.flushall();
});

test.serial('Gets a value', async t => {
  await t.context.githubModel.set('user', 'foobar1');
  const result = await t.context.githubModel.get('user');
  t.is(result, 'foobar1');
});

test.serial('Gets all values', async t => {
  await t.context.githubModel.set('user', 'foobar2');
  const result = await t.context.githubModel.getAll();
  t.is(result.user, 'foobar2');
});

test.serial('Sets a value', async t => {
  await t.context.githubModel.set('user', 'foobar3');
  const result = await t.context.githubModel.get('user');
  t.is(result, 'foobar3');
});

test.serial('Sets all values', async t => {
  await t.context.githubModel.setAll({
    user: 'foobar4',
    repo: 'bazqux1'
  });
  const result = await t.context.githubModel.getAll();
  t.is(result.user, 'foobar4');
  t.is(result.repo, 'bazqux1');
});
