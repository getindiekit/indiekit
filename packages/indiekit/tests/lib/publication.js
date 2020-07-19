import test from 'ava';
import nock from 'nock';
import {JekyllConfig} from '@indiekit/config-jekyll';
import {getFixture} from '../helpers/fixture.js';
import {mockClient} from '../helpers/database.js';
import {
  getCategories,
  getConfig,
  getConfigPreset,
  getMediaEndpoint,
  getStore
} from '../../lib/publication.js';

test.beforeEach(t => {
  t.context = {
    categories: {
      nock: nock('https://website.example').get('/categories.json'),
      url: 'https://website.example/categories.json'
    },
    config: {
      preset: new JekyllConfig().config,
      'slug-separator': '$'
    }
  };
});

test.afterEach.always(() => {
  mockClient.flushall();
});

test('Returns array of available categories', async t => {
  const result = await getCategories(mockClient, ['foo', 'bar']);
  t.deepEqual(result, ['foo', 'bar']);
});

test('Fetches array from remote JSON file specified in `url` value', async t => {
  const scope = t.context.categories.nock.reply(200, ['foo', 'bar']);
  const result = await getCategories(mockClient, t.context.categories);
  t.deepEqual(result, ['foo', 'bar']);
  scope.done();
});

test('Returns empty array if remote JSON file not found', async t => {
  const scope = t.context.categories.nock.replyWithError('Not found');
  const error = await t.throwsAsync(getCategories(mockClient, t.context.categories));
  t.is(error.message, 'Not found');
  scope.done();
});

test('Merges values from custom and default configurations', t => {
  const customConfig = JSON.parse(getFixture('custom-config.json'));
  const result = getConfig(customConfig, t.context.config.preset);
  t.is(result['post-types'][0].template, 'etc/templates/article.njk');
  t.deepEqual(result['post-types'][1], {
    type: 'note',
    name: 'Journal entry',
    template: 'etc/templates/entry.njk',
    post: {
      path: '_entries/{{ published | date(\'X\') }}.md',
      url: 'entries/{{ published | date(\'X\') }}'
    }
  });
  t.deepEqual(result['post-types'][2], {
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

test('Gets configuration preset for a publication', t => {
  const configs = [{
    id: 'foo',
    name: 'Foo'
  }, {
    id: 'bar',
    name: 'Bar'
  }];
  const result = getConfigPreset(configs, 'foo');
  t.is(result.name, 'Foo');
});

test('Gets media endpoint from server derived values', t => {
  const publication = {
    config: {},
    mediaEndpoint: '/media'
  };
  const request = {
    protocol: 'https',
    headers: {
      host: 'server.example'
    }
  };
  const result = getMediaEndpoint(publication, request);
  t.is(result['media-endpoint'], 'https://server.example/media');
});

test('Gets media endpoint from publication configuration', t => {
  const publication = {
    config: {
      'media-endpoint': 'https://website.example/media'
    }
  };
  const request = {
    protocol: 'https',
    headers: {
      host: 'website.example'
    }
  };
  const result = getMediaEndpoint(publication, request);
  t.is(result['media-endpoint'], 'https://website.example/media');
});

test('Gets store function for a publication', t => {
  const stores = [{
    id: 'foo',
    name: 'Foo'
  }, {
    id: 'bar',
    name: 'Bar'
  }];
  const result = getStore(stores, 'foo');
  t.is(result.name, 'Foo');
});
