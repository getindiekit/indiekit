import test from 'ava';
import nock from 'nock';
import {JekyllPreset} from '@indiekit/preset-jekyll';
import {getFixture} from '../helpers/fixture.js';
import {mongodbConfig} from '../../config/mongodb.js';
import {Cache} from '../../lib/cache.js';
import {
  getCategories,
  getMediaEndpoint,
  getPostTypes
} from '../../lib/publication.js';

test.beforeEach(async t => {
  const database = await mongodbConfig(process.env.TEST_MONGODB_URL);
  const collection = await database.collection('cache');

  t.context = await {
    cache: new Cache(collection),
    nock: nock('https://website.example').get('/categories.json'),
    publication: {
      categories: 'https://website.example/categories.json',
      mediaEndpoint: '/media',
      postTypes: JSON.parse(getFixture('post-types.json')),
      preset: new JekyllPreset(),
      store: {id: 'foo'}
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

test.serial('Fetches array from remote JSON file specified in `url` value', async t => {
  const scope = t.context.nock.reply(200, ['foo', 'bar']);
  const result = await getCategories(t.context.cache, t.context.publication);
  t.deepEqual(result, ['foo', 'bar']);
  scope.done();
});

test.serial('Returns empty array if remote JSON file not found', async t => {
  const scope = t.context.nock.replyWithError('Not found');
  const error = await t.throwsAsync(getCategories(t.context.cache, t.context.publication));
  t.is(error.message, `Unable to fetch ${t.context.publication.categories}: Not found`);
  scope.done();
});

test.serial('Returns empty array if no publication config provided', async t => {
  const result = await getCategories(t.context.cache, {});
  t.deepEqual(result, []);
});

test('Merges values from custom and preset post types', t => {
  const result = getPostTypes(t.context.publication);
  t.is(result[0].template, 'etc/templates/article.njk');
  t.deepEqual(result[1], {
    type: 'note',
    name: 'Journal entry',
    template: 'etc/templates/entry.njk',
    post: {
      path: '_entries/{{ published | date(\'X\') }}.md',
      url: 'entries/{{ published | date(\'X\') }}'
    }
  });
  t.deepEqual(result[2], {
    type: 'photo',
    name: 'Picture',
    template: 'etc/templates/picture.njk',
    post: {
      path: '_pictures/{{ published | date(\'X\') }}.md',
      url: '_pictures/{{ published | date(\'X\') }}'
    },
    media: {
      path: 'src/media/pictures/{{ uploaded | date(\'X\') }}.{{ fileext }}',
      url: 'media/pictures/{{ uploaded | date(\'X\') }}.{{ fileext }}'
    }
  });
});

test('Gets media endpoint from server derived values', t => {
  const request = {
    protocol: 'https',
    headers: {
      host: 'server.example'
    }
  };
  const result = getMediaEndpoint(t.context.publication, request);
  t.is(result, 'https://server.example/media');
});

test('Gets media endpoint from publication configuration', t => {
  const publication = {
    mediaEndpoint: 'https://website.example/media'
  };
  const request = {
    protocol: 'https',
    headers: {
      host: 'website.example'
    }
  };
  const result = getMediaEndpoint(publication, request);
  t.is(result, 'https://website.example/media');
});
