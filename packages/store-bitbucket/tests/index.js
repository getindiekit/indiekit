import test from 'ava';
import nock from 'nock';

import {BitbucketStore} from '../index.js';

test.beforeEach(t => {
  t.context = {
    nock: nock('https://api.bitbucket.org'),
    bitbucket: new BitbucketStore({
      user: 'username',
      password: 'password',
      repo: 'repo'
    })
  };
});

test('Creates file in a repository', async t => {
  const scope = t.context.nock
    .post('/2.0/repositories/username/repo/src')
    .reply(201, {
      'Content-Type': 'application/json'
    });
  const response = await t.context.bitbucket.createFile('foo.txt', 'foo', 'Message');
  t.is(response.status, 201);
  t.true(response.url.includes('repositories/username/repo/src'));
  scope.done();
});

test('Throws error creating file in a repository', async t => {
  const scope = t.context.nock
    .post('/2.0/repositories/username/repo/src')
    .replyWithError('Not found');
  const error = await t.throwsAsync(t.context.bitbucket.createFile('foo.txt', 'foo', 'Message'));
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Reads file in a repository', async t => {
  const scope = t.context.nock
    .get('/2.0/repositories/username/repo/src/master/foo.txt')
    .query({format: 'rendered'})
    .reply(201, {raw: 'foo', type: 'rendered'});
  const response = await t.context.bitbucket.readFile('foo.txt');
  t.is(response, 'foo');
  scope.done();
});

test('Throws error reading file in a repository', async t => {
  const scope = t.context.nock
    .get('/2.0/repositories/username/repo/src/master/foo.txt')
    .query({format: 'rendered'})
    .replyWithError('Not found');
  const error = await t.throwsAsync(t.context.bitbucket.readFile('foo.txt'));
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Updates file in a repository', async t => {
  const scope = t.context.nock
    .post('/2.0/repositories/username/repo/src')
    .reply(201, {
      'Content-Type': 'application/json'
    });
  const response = await t.context.bitbucket.updateFile('foo.txt', 'foo', 'Message');
  t.is(response.status, 201);
  t.true(response.url.includes('repositories/username/repo/src'));
  scope.done();
});

test('Throws error updating file in a repository', async t => {
  const scope = t.context.nock
    .post('/2.0/repositories/username/repo/src')
    .replyWithError('Not found');
  const error = await t.throwsAsync(t.context.bitbucket.updateFile('foo.txt', 'foo', 'Message'));
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Deletes a file in a repository', async t => {
  const scope = t.context.nock
    .post('/2.0/repositories/username/repo/src')
    .reply(201, {
      'Content-Type': 'application/json'
    });
  const response = await t.context.bitbucket.deleteFile('foo.txt', 'Message');
  t.is(response.status, 201);
  t.true(response.url.includes('repositories/username/repo/src'));
  scope.done();
});

test('Throws error deleting a file in a repository', async t => {
  const scope = t.context.nock
    .post('/2.0/repositories/username/repo/src')
    .replyWithError('Not found');
  const error = await t.throwsAsync(t.context.bitbucket.deleteFile('foo.txt', 'Message'));
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});
