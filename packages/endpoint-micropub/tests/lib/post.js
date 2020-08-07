import test from 'ava';
import nock from 'nock';
import {JekyllPreset} from '../../../preset-jekyll/index.js';
import {GithubStore} from '../../../store-github/index.js';
import {post} from '../../lib/post.js';
import {postData} from '../fixtures/data.js';

test.beforeEach(t => {
  t.context = {
    publication: {
      config: new JekyllPreset().config,
      me: 'https://website.example',
      store: new GithubStore({
        token: 'abc123',
        user: 'user',
        repo: 'repo'
      }),
      postTemplate(properties) {
        return JSON.stringify(properties);
      },
      posts: {
        insertOne: () => {},
        replaceOne: () => {}
      }
    },
    url: 'https://website.example/foo'
  };
});

test.serial('Creates a post', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Create post'}});
  const result = await post.create(t.context.publication, postData);
  t.deepEqual(result, {
    location: 'https://website.example/foo',
    status: 202,
    json: {
      success: 'create_pending',
      success_description: 'Post will be created at https://website.example/foo'
    }
  });
  scope.done();
});

test('Throws error creating a post', async t => {
  const error = await t.throwsAsync(
    post.create(false, postData)
  );
  t.is(error.message, 'publication.postTemplate is not a function');
});

test.serial('Updates a post', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Update post'}});
  const result = await post.update(t.context.publication, postData, t.context.url);
  t.deepEqual(result, {
    location: 'https://website.example/foo',
    status: 200,
    json: {
      success: 'update',
      success_description: 'Post updated at https://website.example/foo'
    }
  });
  scope.done();
});

test('Throws error updating a post', async t => {
  const error = await t.throwsAsync(
    post.update(false, postData, t.context.url)
  );
  t.is(error.message, 'publication.postTemplate is not a function');
});

test.serial('Deletes a post', async t => {
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.md'))
    .reply(200, {})
    .delete(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Delete post'}});
  const result = await post.delete(t.context.publication, postData);
  t.deepEqual(result, {
    status: 200,
    json: {
      success: 'delete',
      success_description: 'Post deleted from https://website.example/foo'
    }
  });
  scope.done();
});

test('Throws error deleting a post', async t => {
  const error = await t.throwsAsync(
    post.delete(false, postData)
  );
  t.is(error.message, 'Cannot read property \'messageFormat\' of undefined');
});

test.serial('Undeletes a post', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Create post'}})
    .get(uri => uri.includes('foo.md'))
    .reply(200, {})
    .delete(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Delete post'}})
    .put(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Undelete post'}});
  await post.create(t.context.publication, postData);
  await post.delete(t.context.publication, postData);
  const result = await post.undelete(t.context.publication, postData);
  t.deepEqual(result, {
    location: 'https://website.example/foo',
    status: 200,
    json: {
      success: 'delete_undelete',
      success_description: 'Post undeleted from https://website.example/foo'
    }
  });
  scope.done();
});

test('Throws error undeleting a post', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Create post'}})
    .get(uri => uri.includes('foo.md'))
    .reply(200, {})
    .delete(uri => uri.includes('foo.md'))
    .reply(200, {commit: {message: 'Delete post'}})
    .put(uri => uri.includes('foo.md'))
    .replyWithError('Not found');
  await post.create(t.context.publication, postData);
  await post.delete(t.context.publication, postData);
  const error = await t.throwsAsync(
    post.undelete(t.context.publication, postData)
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});

test('Throws error undeleting a post (no post previously deleted)', async t => {
  const error = await t.throwsAsync(
    post.undelete(t.context.publication, false)
  );
  t.is(error.message, 'Post was not previously deleted');
});
