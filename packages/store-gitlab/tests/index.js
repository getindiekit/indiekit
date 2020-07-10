import test from 'ava';
import nock from 'nock';

import {GitlabStore} from '../index.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://gitlab.com'),
    gitlab: new GitlabStore({
      token: 'abc123',
      user: 'user',
      repo: 'repo'
    }),
    nockInstance: nock('https://gitlab.instance'),
    gitlabInstance: new GitlabStore({
      token: 'abc123',
      user: 'user',
      repo: 'repo'
    }),
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

  t.context.gitlabInstance.options.instance = 'https://gitlab.instance';
});

test('Creates file in a repository', async t => {
  const scope = t.context.nock.post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  const response = await t.context.gitlab.createFile('foo.txt', 'foo', 'Message');
  t.is(response.file_path, 'foo.txt');
  t.is(response.branch, 'master');
  scope.done();
});

test('Creates file in a repository at custom instance', async t => {
  const scope = t.context.nockInstance.post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  const response = await t.context.gitlabInstance.createFile('foo.txt', 'foo', 'Message');
  t.is(response.file_path, 'foo.txt');
  t.is(response.branch, 'master');
  scope.done();
});

test('Creates file in a repository with projectId', async t => {
  const scope = t.context.nockInstance.post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  t.context.gitlabInstance.options.projectId = 'user/repo';
  const response = await t.context.gitlabInstance.createFile('foo.txt', 'foo', 'Message');
  t.is(response.file_path, 'foo.txt');
  t.is(response.branch, 'master');
  scope.done();
});

test('Throws error creating file in a repository', async t => {
  const scope = t.context.nock.post(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitlab.createFile('foo.txt', 'foo', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Reads file in a repository', async t => {
  const scope = t.context.nock.get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse);
  const response = await t.context.gitlab.readFile('foo.txt');
  t.is(response, 'foobar');
  scope.done();
});

test('Throws error reading file in a repository', async t => {
  const scope = t.context.nock.get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitlab.readFile('foo.txt')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Updates file in a repository', async t => {
  const scope = t.context.nock.put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await t.context.gitlab.updateFile('foo.txt', 'foo', 'Message');
  t.is(response.file_path, 'foo.txt');
  t.is(response.branch, 'master');
  scope.done();
});

test('Throws error updating file in a repository', async t => {
  const scope = t.context.nock.put(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitlab.updateFile('foo.txt', 'foo', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Deletes a file in a repository', async t => {
  const scope = t.context.nock.delete(uri => uri.includes('foo.txt'))
    .reply(200);
  const response = await t.context.gitlab.deleteFile('foo.txt', 'Message');
  t.truthy(response);
  scope.done();
});

test('Throws error deleting a file in a repository', async t => {
  const scope = t.context.nock.delete(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitlab.deleteFile('foo.txt', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});
