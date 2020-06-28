import test from 'ava';
import {Indiekit} from '../index.js';
import {FooConfig} from './fixtures/config-preset.js';

test('Gets application configuration value', t => {
  const result = new Indiekit();
  t.is(result.application.name, 'Indiekit');
});

test('Gets publication configuration value', t => {
  const result = new Indiekit();
  t.is(result.publication.configPresetId, 'jekyll');
});

test('Sets configuration value', t => {
  const indiekit = new Indiekit();
  indiekit.set('publication.me', 'https://website.example');
  t.is(indiekit.publication.me, 'https://website.example');
});

test('Adds configuration preset', t => {
  const preset = {
    id: 'bar',
    name: 'Bar',
    templatesPath: null
  };
  const indiekit = new Indiekit();
  indiekit.addConfig(preset);
  const {configs} = indiekit.application;
  t.true(configs.some(config => config.id === 'bar'));
});

test('Adds endpoint', t => {
  const endpoint = {
    id: 'foo',
    name: 'Foo',
    init: () => {}
  };
  const indiekit = new Indiekit();
  indiekit.addEndpoint(endpoint);
  const {endpoints} = indiekit.application;
  t.true(endpoints.some(endpoint => endpoint.id === 'foo'));
});

test('Adds store', t => {
  const store = {
    id: 'foo',
    name: 'Foo'
  };
  const indiekit = new Indiekit();
  indiekit.addStore(store);
  const {stores} = indiekit.application;
  t.true(stores.some(store => store.id === 'foo'));
});

test('Initiates application', async t => {
  const fooConfig = new FooConfig();
  const indiekit = new Indiekit();
  indiekit.addConfig(fooConfig);
  indiekit.set('publication.configPresetId', 'foo');
  indiekit.set('publication.config.categories', ['foo', 'bar']);
  await indiekit.init();
  t.is(indiekit.publication.config['post-types'][0].name, 'Foo note');
  t.is(indiekit.publication.config.categories[0], 'foo');
});
