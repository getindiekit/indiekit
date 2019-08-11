const nock = require('nock');
const test = require('ava');

const resolveConfig = require(process.env.PWD + '/app/lib/publication/resolve-config.js');

test.before(t => {
  t.context.defaults = {
    categories: [],
    'post-types': {
      note: {
        type: 'note',
        name: 'Note',
        icon: ':notebook_with_decorative_cover:',
        template: 'note.njk',
        post: {
          path: '_notes/{{ slug }}.md',
          url: 'notes/{{ slug }}'
        }
      },
      photo: {
        name: 'Photo',
        icon: ':camera:',
        template: 'photo.njk',
        post: {
          path: '_photos/{{ slug }}.md',
          url: 'photos/{{ slug }}'
        },
        media: {
          path: 'media/photos/{{ filename }}'
        }
      }
    },
    'slug-separator': '-',
    'syndicate-to': []
  };
});

test('Returns default configuration if none provided', async t => {
  const result = await resolveConfig(null, t.context.defaults);
  t.deepEqual(result, t.context.defaults);
});

test('Merges publisher configuration with defaults', async t => {
  const pubConfig = {
    'slug-separator': 'foo'
  };
  const result = await resolveConfig(pubConfig, t.context.defaults);
  t.is(result['slug-separator'], 'foo');
});

test('Merge publisher post types with defaults', async t => {
  const pubConfig = {
    'post-types': {
      note: {
        name: 'Foobar'
      }
    }
  };
  const result = await resolveConfig(pubConfig, t.context.defaults);
  t.is(result['post-types'].note.name, 'Foobar');
});

test('Throws error if `post-types` is not an object', async t => {
  const pubConfig = {
    'post-types': [{
      type: 'note',
      name: 'foo'
    }, {
      type: 'article',
      name: 'bar'
    }]
  };
  const error = await t.throwsAsync(resolveConfig(pubConfig, t.context.defaults));
  t.is(error.message.error_description, '`post-types` should be an object');
});

test('Throws error if post type value is not an object', async t => {
  const pubConfig = {
    'post-types': {
      note: true
    }
  };
  const error = await t.throwsAsync(resolveConfig(pubConfig, t.context.defaults));
  t.is(error.message.error_description, 'Post type should be an object');
});

test('Updates `template` value with cache key', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foobar.njk'))
    .reply(200, {
      content: 'Zm9vYmFy'
    });

  // Setup
  const pubConfig = {
    'post-types': {
      note: {
        name: 'Foobar',
        template: 'foobar.njk'
      }
    }
  };
  const result = await resolveConfig(pubConfig, t.context.defaults);

  // Test assertions
  t.is(result['post-types'].note.template.cacheKey, 'foobar.njk');
  scope.done();
});
