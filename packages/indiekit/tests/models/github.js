import test from 'ava';
import {mockClient} from '../helpers/database.js';
import {GithubModel} from '../../models/github.js';

const githubModel = new GithubModel(mockClient);

test.afterEach.always(() => {
  mockClient.flushall();
});

test('Throws an error', async t => {
  const clientlessModel = new GithubModel({});
  const error = await t.throwsAsync(clientlessModel.getAll());
  t.true(error instanceof Error);
});

test.serial('Gets a value', async t => {
  await githubModel.set('user', 'foobar');
  const result = await githubModel.get('user');
  t.is(result, 'foobar');
});

test.serial('Gets all values', async t => {
  await githubModel.set('user', 'foobar');
  const result = await githubModel.getAll();
  t.is(result.user, 'foobar');
});

test.serial('Sets a value', async t => {
  await githubModel.set('user', 'foobar');
  const result = await githubModel.get('user');
  t.is(result, 'foobar');
});

test.serial('Sets all values', async t => {
  await githubModel.setAll({
    user: 'foobar',
    repo: 'bazqux'
  });
  const result = await githubModel.getAll();
  t.is(result.user, 'foobar');
  t.is(result.repo, 'bazqux');
});
