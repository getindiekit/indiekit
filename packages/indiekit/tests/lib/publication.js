import test from 'ava';
import nock from 'nock';
import {publication} from '@indiekit-test/publication';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {mongodbConfig} from '../../config/mongodb.js';
import {Cache} from '../../lib/cache.js';
import {
  getCategories,
  getPostTemplate,
  getPostTypes
} from '../../lib/publication.js';

test.beforeEach(async t => {
  const database = await mongodbConfig(process.env.TEST_MONGODB_URL);
  const collection = await database.collection('cache');

  t.context = await {
    cache: new Cache(collection),
    publication: {
      mediaEndpoint: '/media',
      postTypes: [{
        type: 'note',
        name: 'Journal entry',
        post: {
          path: '_entries/{T}.md',
          url: 'entries/{T}'
        }
      }, {
        type: 'photo',
        name: 'Picture',
        post: {
          path: '_pictures/{T}.md',
          url: '_pictures/{T}'
        },
        media: {
          path: 'src/media/pictures/{T}.{ext}',
          url: 'media/pictures/{T}.{ext}'
        }
      }],
      preset: new JekyllPreset()
    }
  };
});

test.afterEach.always(async () => {
  const database = await mongodbConfig(process.env.TEST_MONGODB_URL);
  await database.dropDatabase();
});

test('Returns array of available categories', async t => {
  const result = await getCategories(t.context.cache, {
    categories: ['foo', 'bar']
  });

  t.deepEqual(result, ['foo', 'bar']);
});

test.serial('Fetches array from remote JSON file', async t => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get('/categories.json')
    .reply(200, ['foo', 'bar']);

  const result = await getCategories(t.context.cache, publication);

  t.deepEqual(result, ['foo', 'bar']);
});

test.serial('Returns empty array if remote JSON file not found', async t => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get('/categories.json')
    .replyWithError('Not found');

  await t.throwsAsync(getCategories(t.context.cache, publication), {
    message: `Unable to fetch ${process.env.TEST_PUBLICATION_URL}categories.json: Not found`
  });
});

test.serial('Returns empty array if no publication config provided', async t => {
  const result = await getCategories(t.context.cache, {});

  t.deepEqual(result, []);
});

test('Gets custom post template', t => {
  const postTemplate = getPostTemplate(publication);

  const result = postTemplate({published: '2021-01-21'});

  t.is(result, '{"published":"2021-01-21"}');
});

test('Gets preset post template', t => {
  const postTemplate = getPostTemplate(t.context.publication);

  const result = postTemplate({published: '2021-01-21'});

  t.is(result, '---\ndate: 2021-01-21\n---\n');
});

test('Gets default post template', t => {
  const postTemplate = getPostTemplate({});

  const result = postTemplate({published: '2021-01-21'});

  t.is(result, '{"published":"2021-01-21"}');
});

test('Merges values from custom and preset post types', t => {
  const result = getPostTypes(t.context.publication);

  t.deepEqual(result[1], {
    type: 'note',
    name: 'Journal entry',
    post: {
      path: '_entries/{T}.md',
      url: 'entries/{T}'
    }
  });
  t.deepEqual(result[2], {
    type: 'photo',
    name: 'Picture',
    post: {
      path: '_pictures/{T}.md',
      url: '_pictures/{T}'
    },
    media: {
      path: 'src/media/pictures/{T}.{ext}',
      url: 'media/pictures/{T}.{ext}'
    }
  });
});

test('Returns array if no preset or custom post types', t => {
  t.deepEqual(getPostTypes({}), []);
});
