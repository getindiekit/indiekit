import test from 'ava';
import nock from 'nock';
import {BitbucketStore} from '../../index.js';

const bitbucket = new BitbucketStore({
  user: 'username',
  password: 'password',
  repo: 'repo',
});

test.beforeEach(t => {
  t.context.bitbucketUrl = 'https://api.bitbucket.org';
});

test('Gets plug-in info', t => {
  t.is(bitbucket.name, 'Bitbucket store');
  t.is(bitbucket.info.name, 'username/repo on Bitbucket');
  t.is(bitbucket.info.uid, 'https://bitbucket.org/username/repo');
});

test('Creates file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .post('/2.0/repositories/username/repo/src')
    .reply(201, {
      'Content-Type': 'application/json',
    });

  const result = await bitbucket.createFile('foo.txt', 'foo', 'Message');

  t.is(result.status, 201);
  t.true(result.url.includes('repositories/username/repo/src'));
});

test('Throws error creating file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .post('/2.0/repositories/username/repo/src')
    .replyWithError('Not found');

  await t.throwsAsync(bitbucket.createFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/,
  });
});

test('Reads file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .get('/2.0/repositories/username/repo/src/main/foo.txt')
    .query({format: 'rendered'})
    .reply(201, {raw: 'foo', type: 'rendered'});

  const result = await bitbucket.readFile('foo.txt');

  t.is(result, 'foo');
});

test('Throws error reading file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .get('/2.0/repositories/username/repo/src/main/foo.txt')
    .query({format: 'rendered'})
    .replyWithError('Not found');

  await t.throwsAsync(bitbucket.readFile('foo.txt'), {
    message: /\bNot found\b/,
  });
});

test('Updates file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .post('/2.0/repositories/username/repo/src')
    .reply(201, {
      'Content-Type': 'application/json',
    });

  const result = await bitbucket.updateFile('foo.txt', 'foo', 'Message');

  t.is(result.status, 201);
  t.true(result.url.includes('repositories/username/repo/src'));
});

test('Throws error updating file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .post('/2.0/repositories/username/repo/src')
    .replyWithError('Not found');

  await t.throwsAsync(bitbucket.updateFile('foo.txt', 'foo', 'Message'), {
    message: /\bNot found\b/,
  });
});

test('Deletes a file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .post('/2.0/repositories/username/repo/src')
    .reply(201, {
      'Content-Type': 'application/json',
    });

  const result = await bitbucket.deleteFile('foo.txt', 'Message');

  t.is(result.status, 201);
  t.true(result.url.includes('repositories/username/repo/src'));
});

test('Throws error deleting a file in a repository', async t => {
  nock(t.context.bitbucketUrl)
    .post('/2.0/repositories/username/repo/src')
    .replyWithError('Not found');

  await t.throwsAsync(bitbucket.deleteFile('foo.txt', 'Message'), {
    message: /\bNot found\b/,
  });
});
