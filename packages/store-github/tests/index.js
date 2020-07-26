import test from 'ava';
import nock from 'nock';

import {GithubStore} from '../index.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://api.github.com'),
    github: new GithubStore({
      token: 'abc123',
      user: 'user',
      repo: 'repo'
    }),
    getResponse: {
      content: 'Zm9vYmFy',
      sha: '\b[0-9a-f]{5,40}\b',
      name: 'foo.txt',
      path: 'foo.txt'
    },
    putResponse: {
      commit: {
        message: 'Message'
      }
    }
  };
});

test('Gets message format', async t => {
  const result = await t.context.github.messageFormat;
  t.is(result, '{action} {postType} {fileType}');
});

test('Creates file in a repository', async t => {
  const scope = t.context.nock
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await t.context.github.createFile('foo.txt', 'foo', 'Message');
  t.truthy(response);
  t.is(response.data.commit.message, 'Message');
  scope.done();
});

test('Throws error creating file in a repository', async t => {
  const scope = t.context.nock
    .put(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.github.createFile('foo.txt', 'foo', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Reads file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse);
  const response = await t.context.github.readFile('foo.txt');
  t.is(response, 'foobar');
  scope.done();
});

test('Throws error reading file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.github.readFile('foo.txt')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Updates file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await t.context.github.updateFile('foo.txt', 'foo', 'Message');
  t.is(response.status, 200);
  t.is(response.data.commit.message, 'Message');
  scope.done();
});

test('Creates file if original not found in repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found')
    .put(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await t.context.github.updateFile('foo.txt', 'foo', 'Message');
  t.is(response.status, 200);
  t.is(response.data.commit.message, 'Message');
  scope.done();
});

test('Throws error updating file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .put(uri => uri.includes('foo.txt'))
    .replyWithError('Unknown error');
  const error = await t.throwsAsync(
    t.context.github.updateFile('foo.txt', 'foo', {message: 'Message'})
  );
  t.regex(error.message, /\bUnknown error\b/);
  scope.done();
});

test('Deletes a file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .reply(200, t.context.putResponse);
  const response = await t.context.github.deleteFile('foo.txt', 'Message');
  t.is(response.status, 200);
  t.is(response.data.commit.message, 'Message');
  scope.done();
});

test('Throws error if file not found in repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .replyWithError('Not found');
  const error = await t.throwsAsync(
    t.context.github.deleteFile('foo.txt', 'Message')
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Throws error deleting a file in a repository', async t => {
  const scope = t.context.nock
    .get(uri => uri.includes('foo.txt'))
    .reply(200, t.context.getResponse)
    .delete(uri => uri.includes('foo.txt'))
    .replyWithError('Unknown error');
  const error = await t.throwsAsync(
    t.context.github.deleteFile('foo.txt', 'Message')
  );
  t.regex(error.message, /\bUnknown error\b/);
  scope.done();
});
