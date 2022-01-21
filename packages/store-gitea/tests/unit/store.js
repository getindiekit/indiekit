import test from 'ava';
import nock from 'nock';

import {GiteaStore} from '../../index.js';

const gitea = new GiteaStore({
  token: 'abc123',
  user: 'username',
  repo: 'repo',
});

const giteaInstance = new GiteaStore({
  token: 'abc123',
  user: 'username',
  repo: 'repo',
});

test.beforeEach(t => {
  t.context = {
    giteaUrl: 'https://gitea.com',
    giteaInstanceUrl: 'https://gitea.instance',
    getResponse: {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b',
      path: 'foo.txt',
    },
    postResponse: {
      path: 'foo.txt',
      branch: 'main',
    },
    putResponse: {
      path: 'foo.txt',
      branch: 'main',
    },
    deleteResponse: {
      commit: {
        message: 'Message',
        sha: '\b[0-9a-f]{5,40}\b',
      },
      content: {},
    },
  };
});

test('Gets plug-in info', t => {
  t.is(gitea.name, 'Gitea store');
  t.is(gitea.info.name, 'username/repo on Gitea');
  t.is(gitea.info.uid, 'https://gitea.com/username/repo');
});

test('Creates file in a repository', async t => {
  nock(t.context.giteaUrl)
    .post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);

  const result = await gitea.createFile('foo.txt', 'foo', 'Message');

  t.is(result.body.path, 'foo.txt');
  t.is(result.body.branch, 'main');
});

test('Creates file in a repository at custom instance', async t => {
  nock(t.context.giteaInstanceUrl)
    .post(uri => uri.includes('foo.txt'))
    .reply(200, t.context.postResponse);
  giteaInstance.options.instance = t.context.giteaInstanceUrl;

  const result = await giteaInstance.createFile('foo.txt', 'foo', 'Message');

  t.is(result.body.path, 'foo.txt');
  t.is(result.body.branch, 'main');
});

test('Throws error creating file in a repository', async t => {
  nock(t.context.giteaUrl)
    .post(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitea.createFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/,
  });
});

test('Reads file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse);

  const result = await gitea.readFile('foo.txt');

  t.is(result, 'foobar');
});

test('Throws error reading file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitea.readFile('foo.txt'), {
    message: /\bNot found\b/,
  });
});

test('Updates file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);

  const result = await gitea.updateFile('foo.txt', 'foo', 'Message');

  t.is(result.body.path, 'foo.txt');
  t.is(result.body.branch, 'main');
});

test('Throws error updating file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitea.updateFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/,
  });
});

test('Deletes a file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .reply(200, t.context.deleteResponse);

  const result = await gitea.deleteFile('foo.txt', 'Message');

  t.truthy(result);
});

test('Throws error deleting a file in a repository', async t => {
  nock(t.context.giteaUrl)
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');

  await t.throwsAsync(gitea.deleteFile('foo.txt', 'Message'), {
    message: /\bNot found\b/,
  });
});
