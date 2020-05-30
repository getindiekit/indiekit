import test from 'ava';
import {mockClient} from '../helpers/database.js';
import {GitlabModel} from '../../models/gitlab.js';

const gitlabModel = new GitlabModel(mockClient);

test.afterEach.always(() => {
  mockClient.flushall();
});

test.serial('Gets a value', async t => {
  await gitlabModel.set('user', 'foobar');
  const result = await gitlabModel.get('user');
  t.is(result, 'foobar');
});

test.serial('Gets all values', async t => {
  await gitlabModel.set('user', 'foobar');
  const result = await gitlabModel.getAll();
  t.is(result.user, 'foobar');
});

test.serial('Sets a value', async t => {
  await gitlabModel.set('user', 'foobar');
  const result = await gitlabModel.get('user');
  t.is(result, 'foobar');
});

test.serial('Sets all values', async t => {
  await gitlabModel.setAll({
    user: 'foobar',
    repo: 'bazqux'
  });
  const result = await gitlabModel.getAll();
  t.is(result.user, 'foobar');
  t.is(result.repo, 'bazqux');
});
