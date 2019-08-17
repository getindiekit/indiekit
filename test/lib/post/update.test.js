const nock = require('nock');
const test = require('ava');

const post = require(process.env.PWD + '/lib/post');
const pub = require('./fixtures/create-config');

test.beforeEach(t => {
  t.context.postData = {
    post: {
      type: 'note',
      path: 'baz.md',
      url: 'https://foo.bar/baz'
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        content: ['hello world'],
        published: ['2019-08-17T23:56:38.977+01:00'],
        category: ['foo', 'bar'],
        slug: ['baz']
      }
    }
  };
});

test.serial('Updates a post by replacing its content', async t => {
  // Mock GitHub update file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  const {postData} = t.context;
  const body = {
    action: 'update',
    url: 'https://foo.bar/baz',
    replace: {
      content: ['hello moon']
    }
  };
  const undeleted = await post.update(pub, postData, body);

  // Test assertions
  t.is(undeleted.mf2.properties.content[0], 'hello moon');
  scope.done();
});

test.serial('Updates a post by adding a syndication value', async t => {
  // Mock GitHub update file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  const {postData} = t.context;
  const body = {
    action: 'update',
    url: 'https://foo.bar/baz',
    add: {
      syndication: ['http://web.archive.org/web/20190818120000/https://foo.bar/baz']
    }
  };
  const undeleted = await post.update(pub, postData, body);

  // Test assertions
  t.is(undeleted.mf2.properties.syndication[0], 'http://web.archive.org/web/20190818120000/https://foo.bar/baz');
  scope.done();
});

test.serial('Updates a post by deleting a property', async t => {
  // Mock GitHub update file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  const {postData} = t.context;
  const body = {
    action: 'update',
    url: 'https://foo.bar/baz',
    delete: ['category']
  };
  const undeleted = await post.update(pub, postData, body);

  // Test assertions
  t.falsy(undeleted.mf2.properties.category);
  scope.done();
});

test.serial('Updates a post by deleting an entry in a property', async t => {
  // Mock GitHub update file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('baz.md'))
    .reply(200);

  // Setup
  const {postData} = t.context;
  const body = {
    action: 'update',
    url: 'https://foo.bar/baz',
    delete: {
      category: ['foo']
    }
  };
  const undeleted = await post.update(pub, postData, body);

  // Test assertions
  t.deepEqual(undeleted.mf2.properties.category, ['bar']);
  scope.done();
});

test.serial('Throws error if GitHub responds with an error', async t => {
  // Mock GitHub update file request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('baz.md'))
    .reply(200, {
      content: 'Zm9vYmFy'
    })
    .put(uri => uri.includes('baz.md'))
    .replyWithError('not found');

  // Setup
  const postData = {
    post: {
      type: 'note',
      path: '_notes/2019-08-17-baz.md',
      url: `${process.env.INDIEKIT_URL}/notes/2019/08/17/baz`
    },
    mf2: {
      type: ['h-entry'],
      properties: {
        content: ['hello world'],
        published: ['2019-08-17T23:56:38.977+01:00'],
        category: ['foo', 'bar'],
        slug: ['baz']
      }
    }
  };
  const body = {
    action: 'update',
    url: 'https://foo.bar/baz',
    replace: {
      content: ['hello moon']
    }
  };
  const error = await t.throwsAsync(post.update(pub, postData, body));

  // Test assertions
  t.regex(error.message.error_description, /\bnot found\b/);
  scope.done();
});
