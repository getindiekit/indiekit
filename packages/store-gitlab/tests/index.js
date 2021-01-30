import test from 'ava';
import nock from 'nock';
import {GitlabStore} from '../index.js';

const gitlab = new GitlabStore({
  token: 'abc123',
  user: 'user',
  repo: 'repo'
});

const gitlabInstance = new GitlabStore({
  token: 'abc123',
  user: 'user',
  repo: 'repo'
});

test.beforeEach(t => {
  t.context = {
    gitlabUrl: 'https://gitlab.com',
    gitlabInstanceUrl: 'https://gitlab.instance',
    getResponse: {
      content: 'Zm9vYmFy',
      commit_id: '\b[0-9a-f]{5,40}\b', // eslint-disable-line camelcase
      file_path: 'foo.txt' // eslint-disable-line camelcase
    },
    postResponse: {
      file_path: 'foo.txt', // eslint-disable-line camelcase
      branch: 'master'
    },
    putResponse: {
      file_path: 'foo.txt', // eslint-disable-line camelcase
      branch: 'master'
    }
  };
});

test('Creates file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);

  const result = await gitlab.createFile('foo.txt', 'foo', 'Message');

  t.is(result.file_path, 'foo.txt');
  t.is(result.branch, 'master');
});

test('Creates file in a repository at custom instance', async t => {
  nock(t.context.gitlabInstanceUrl)
    .post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  gitlabInstance.options.instance = 'https://gitlab.instance';

  const result = await gitlabInstance.createFile('foo.txt', 'foo', 'Message');

  t.is(result.file_path, 'foo.txt');
  t.is(result.branch, 'master');
});

test('Creates file in a repository with projectId', async t => {
  nock(t.context.gitlabInstanceUrl)
    .post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  gitlabInstance.options = {
    instance: t.context.gitlabInstanceUrl,
    projectId: 'user/repo'
  };

  const result = await gitlabInstance.createFile('foo.txt', 'foo', 'Message');

  t.is(result.file_path, 'foo.txt');
  t.is(result.branch, 'master');
});

test('Throws error creating file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .post(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitlab.createFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/
  });
});

test('Reads file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse);

  const result = await gitlab.readFile('foo.txt');

  t.is(result, 'foobar');
});

test('Throws error reading file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitlab.readFile('foo.txt'), {
    message: /\bNot found\b/
  });
});

test('Updates file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);

  const result = await gitlab.updateFile('foo.txt', 'foo', 'Message');

  t.is(result.file_path, 'foo.txt');
  t.is(result.branch, 'master');
});

test('Throws error updating file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .put(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitlab.updateFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/
  });
});

test('Deletes a file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .delete(uri => uri.includes('foo.txt'))
    .reply(200);

  const result = await gitlab.deleteFile('foo.txt', 'Message');

  t.truthy(result);
});

test('Throws error deleting a file in a repository', async t => {
  nock(t.context.gitlabUrl)
    .delete(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitlab.deleteFile('foo.txt', 'Message'), {
    message: /\bNot found\b/
  });
});
