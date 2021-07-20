import test from 'ava';
import nock from 'nock';
import {indiekitConfig} from '@indiekit-test/config';
import {Cache} from '../../lib/cache.js';
import {
  getCategories,
  getMediaEndpoint,
  getPostTemplate,
  getPostTypes
} from '../../lib/publication.js';

const config = (async () => {
  return indiekitConfig()
})();

test.beforeEach(async t => {
  const {application, publication} = await config;

  t.context = {
    cacheCollection: application.cache,
    publication
  };
});

test('Returns array of available categories', async t => {
  const result = await getCategories(t.context.cache, {
    categories: ['foo', 'bar']
  });

  t.deepEqual(result, ['foo', 'bar']);
});

test('Fetches array from remote JSON file', async t => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get('/categories.json')
    .reply(200, ['foo', 'bar']);
  t.context.publication.categories = `${process.env.TEST_PUBLICATION_URL}categories.json`;
  const cache = new Cache(t.context.cacheCollection);

  const result = await getCategories(cache, t.context.publication);

  t.deepEqual(result, ['foo', 'bar']);
});

test.serial('Returns empty array if remote JSON file not found', async t => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get('/categories.json')
    .replyWithError('Not found');
  t.context.publication.categories = `${process.env.TEST_PUBLICATION_URL}categories.json`;
  const cache = new Cache(t.context.cacheCollection);

  await t.throwsAsync(getCategories(cache, t.context.publication), {
    message: `Unable to fetch ${process.env.TEST_PUBLICATION_URL}categories.json: Not found`
  });
});

test('Returns empty array if no publication config provided', async t => {
  const cache = new Cache(t.context.cacheCollection);

  const result = await getCategories(cache, {});

  t.deepEqual(result, []);
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
  const publication = {mediaEndpoint: 'https://website.example/media'};
  const request = {
    protocol: 'https',
    headers: {
      host: 'website.example'
    }
  };

  const result = getMediaEndpoint(publication, request);

  t.is(result, 'https://website.example/media');
});

test('Gets custom post template', t => {
  const publication = {
    postTemplate: properties => {
      return JSON.stringify(properties);
    }
  };
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
  t.context.publication.postTypes = [{
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
  }];
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
