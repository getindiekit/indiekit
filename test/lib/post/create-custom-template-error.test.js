const nock = require('nock');
const test = require('ava');

const cache = require(process.env.PWD + '/lib/cache');
const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');

const outputDir = process.env.PWD + '/.ava_output/post-create-custom-template-error';

test.before(() => {
  config.data.dir = outputDir;
});

test('Throws error getting publisher configured template', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .replyWithError('not found');

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
  const error = await t.throwsAsync(post.create(pub, body));

  // Test assertions
  t.regex(error.message.error_description, /\bnot found\b/);
  scope.done();
});
