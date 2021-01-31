import test from 'ava';
import nock from 'nock';

import {GiteaStore} from '../../index.js';

test.beforeEach(t => {
  t.context = {
    gitea: new GiteaStore({
      token: 'abc123',
      user: 'user',
      repo: 'repo'
    }),
    giteaUrl: 'https://gitea.com',
    giteaInstance: new GiteaStore({
      token: 'abc123',
      user: 'user',
      repo: 'repo'
    }),
    giteaInstanceUrl: 'https://gitea.instance',
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
    },
    deleteResponse: {
      commit: {
        message: 'Message',
        sha: '\b[0-9a-f]{5,40}\b'
      },
      content: {}
    }
  };
});

test('Creates file in a repository', async t => {
  nock(t.context.giteaUrl)
    .post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);

  const result = await t.context.gitea.createFile('foo.txt', 'foo', 'Message');

  t.is(result.body.path, 'foo.txt');
  t.is(result.body.branch, 'master');
});

test('Creates file in a repository at custom instance', async t => {
  nock(t.context.giteaInstanceUrl)
    .post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  t.context.giteaInstance.options.instance = t.context.giteaInstanceUrl;

  const result = await t.context.giteaInstance.createFile('foo.txt', 'foo', 'Message');

  t.is(result.body.path, 'foo.txt');
  t.is(result.body.branch, 'master');
});

test('Throws error creating file in a repository', async t => {
  nock(t.context.giteaUrl)
    .post(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(t.context.gitea.createFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/
  });
});

test('Reads file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse);

  const result = await t.context.gitea.readFile('foo.txt');

  t.is(result, 'foobar');
});

test('Throws error reading file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(t.context.gitea.readFile('foo.txt'), {
    message: /\bNot found\b/
  });
});

test('Updates file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);

  const result = await t.context.gitea.updateFile('foo.txt', 'foo', 'Message');

  t.is(result.body.path, 'foo.txt');
  t.is(result.body.branch, 'master');
});

test('Throws error updating file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(t.context.gitea.updateFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/
  });
});

test('Deletes a file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .reply(200, t.context.deleteResponse);

  const result = await t.context.gitea.deleteFile('foo.txt', 'Message');

  t.truthy(result);
});

test('Throws error deleting a file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(t.context.gitea.deleteFile('foo.txt', 'Message'), {
    message: /\bNot found\b/
  });
});
