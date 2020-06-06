import test from 'ava';
import nock from 'nock';

import {Host} from '../index.js';
const github = new Host({
  token: 'abc123',
  user: 'user',
  repo: 'repo'
});

test.beforeEach(t => {
  t.context = {
    nock: nock('https://api.github.com'),
    getResponse: {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b',
      name: 'foo.txt',
      path: 'bar/foo.txt'
    },
    putResponse: {
      commit: {
        message: 'Commit message'
      }
    }
  };
});

test('Creates file in a repository', async t => {
  const scope = t.context.nock
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await github.createFile('bar/foo.txt', 'foo', 'Create message');
  t.truthy(response);
  t.is(response.data.commit.message, 'Commit message');
  scope.done();
});

test('Throws error creating file in a repository', async t => {
  const scope = t.context.nock
    .put(uri => uri.includes('foo.txt'))
    .replyWithError('not found');
  const error = await t.throwsAsync(github.createFile('bar/foo.txt', 'foo', 'Create message'));
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});

test('Deletes a file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await github.deleteFile('foo.txt', 'Delete message');
  t.is(response.status, 200);
  t.is(response.data.commit.message, 'Commit message');
  scope.done();
});

test('Throws error if file not found in repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('not found');
  const error = await t.throwsAsync(github.deleteFile('foo.txt', 'Delete message'));
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});

test('Throws error deleting a file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .replyWithError('unknown error');
  const error = await t.throwsAsync(github.deleteFile('foo.txt', 'Delete message'));
  t.regex(error.message, /\bunknown error\b/);
  scope.done();
});

test('Reads file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse);
  const response = await github.readFile('foo.txt');
  t.is(response, 'foobar');
  scope.done();
});

test('Throws error reading file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('not found');
  const error = await t.throwsAsync(github.readFile('bar/foo.txt'));
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});

test('Updates file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);

  const response = await github.updateFile('foo.txt', 'foo', 'Commit message');

  t.is(response.status, 200);
  t.is(response.data.commit.message, 'Commit message');
  scope.done();
});

test('Creates file if original not found in repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('not found')
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);

  const response = await github.updateFile('foo.txt', 'foo', 'Commit message');

  t.is(response.status, 200);
  t.is(response.data.commit.message, 'Commit message');
  scope.done();
});

test('Throws error updating file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .put(uri => uri.includes('foo.txt'))
    .replyWithError('unknown error');

  const error = await t.throwsAsync(github.updateFile('foo.txt', 'foo', {
    message: 'Update message'
  }));

  t.regex(error.message, /\bunknown error\b/);
  scope.done();
});
