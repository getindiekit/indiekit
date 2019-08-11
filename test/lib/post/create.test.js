const path = require('path');
const fs = require('fs-extra');
const nock = require('nock');
const test = require('ava');
const validUrl = require('valid-url');

const cache = require(process.env.PWD + '/lib/cache');
const config = require(process.env.PWD + '/app/config');
const post = require(process.env.PWD + '/lib/post');
const pub = require('./fixtures/create-config');

const outputDir = process.env.PWD + '/.ava_output/post-create';

test.before(() => {
  config.data.dir = outputDir;
});

test('Creates a note post', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .reply(200);

  // Setup
  const body = require('./fixtures/type-note');
  const response = await post.create(pub, body);

  // Test assertions
  t.truthy(validUrl.isUri(response));
  scope.done();
});

test('Creates a photo post', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .reply(200);

  // Setup
  const body = require('./fixtures/type-note');
  const photo = fs.readFileSync(path.resolve(__dirname, 'fixtures/image.gif'));
  const files = [{
    buffer: Buffer.from(photo),
    mimetype: 'image/gif',
    originalname: 'image.gif'
  }];
  const response = await post.create(pub, body, files);

  // Test assertions
  t.truthy(validUrl.isUri(response));
  scope.done();
});

test.skip('Gets publisher configured template from cache', async t => {
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
  const response = await post.create(pub, body);

  // Test assertions
  t.truthy(validUrl.isUri(response));
  scope.done();
});

test('Throws error if GitHub responds with an error', async t => {
  // Mock request
  const scope = nock('https://api.github.com')
    .put(/[\d\w]{5}/g)
    .replyWithError('Not found');

  // Setup
  const body = require('./fixtures/type-note');
  const error = await t.throwsAsync(post.create(pub, body));

  // Test assertions
  t.regex(error.message.error_description, /\bNot found\b/);
  scope.done();
});

test.after(async () => {
  await fs.emptyDir(outputDir);
});
