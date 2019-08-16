const fs = require('fs-extra');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const cache = require(process.env.PWD + '/lib/cache');
const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');

const outputDir = process.env.PWD + '/.ava_output/post-create-custom-template';

test.before(() => {
  config.data.dir = outputDir;
});

test('Gets publisher configured template from cache', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .reply(200);

  // Setup
  cache.set('foobar.njk', 'foobar');
  const pub = {
    'post-types': {
      note: {
        name: 'Foobar',
        template: {
          cacheKey: 'foobar.njk'
        },
        post: {
          path: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }
    }
  };
  const body = require('./fixtures/type-note');
  const created = await post.create(pub, body);

  // Test assertions
  t.truthy(validUrl.isUri(created.post.url));
  scope.done();
});

test('Throws error if `template.cacheKey` value is invalid', async t => {
  // Setup
  const pub = {
    'post-types': {
      note: {
        name: 'Foobar',
        template: {
          cacheKey: null
        },
        post: {
          path: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }
    }
  };
  const body = require('./fixtures/type-note');
  const error = await t.throwsAsync(post.create(pub, body));

  // Test assertions
  t.is(error.message.error, 'TypeError');
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
