import test from 'ava';
import nock from 'nock';

import {GiteaStore} from '../index.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://gitea.com'),
    gitea: new GiteaStore({
      token: 'abc123',
      user: 'user',
      repo: 'repo'
    }),
    nockInstance: nock('https://gitea.instance'),
    giteaInstance: new GiteaStore({
      token: 'abc123',
      user: 'user',
      repo: 'repo'
    }),
    getResponse: {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b',
      path: 'foo.txt'
    },
    postResponse: {
      path: 'foo.txt',
      branch: 'master'
    },
    putResponse: {
      path: 'foo.txt',
      branch: 'master'
    }
  };

  t.context.giteaInstance.options.instance = 'https://gitea.instance';
});

test('Creates file in a repository', async t => {
  const scope = t.context.nock.post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  const response = await t.context.gitea.createFile('foo.txt', 'foo', 'Message');
  t.is(response.body.path, 'foo.txt');
  t.is(response.body.branch, 'master');
  scope.done();
});

test('Creates file in a repository at custom instance', async t => {
  const scope = t.context.nockInstance.post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  const response = await t.context.giteaInstance.createFile('foo.txt', 'foo', 'Message');
  t.is(response.body.path, 'foo.txt');
  t.is(response.body.branch, 'master');
  scope.done();
});

test('Throws error creating file in a repository', async t => {
  const scope = t.context.nock.post(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitea.createFile('foo.txt', 'foo', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Reads file in a repository', async t => {
  const scope = t.context.nock.get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse);
  const response = await t.context.gitea.readFile('foo.txt');
  t.is(response, 'foobar');
  scope.done();
});

test('Throws error reading file in a repository', async t => {
  const scope = t.context.nock.get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitea.readFile('foo.txt')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Updates file in a repository', async t => {
  const scope = t.context.nock.put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await t.context.gitea.updateFile('foo.txt', 'foo', 'Message');
  t.is(response.body.path, 'foo.txt');
  t.is(response.body.branch, 'master');
  scope.done();
});

test('Throws error updating file in a repository', async t => {
  const scope = t.context.nock.put(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitea.updateFile('foo.txt', 'foo', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Deletes a file in a repository', async t => {
  const scope = t.context.nock.delete(uri => uri.includes('foo.txt'))
    .reply(200);
  const response = await t.context.gitea.deleteFile('foo.txt', 'Message');
  t.truthy(response);
  scope.done();
});

test('Throws error deleting a file in a repository', async t => {
  const scope = t.context.nock.delete(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.gitea.deleteFile('foo.txt', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});
