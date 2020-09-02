import test from 'ava';
import {Indiekit} from '../index.js';
import {Preset} from './fixtures/preset.js';

const indiekit = new Indiekit();

test('Gets application configuration value', t => {
  t.is(indiekit.application.name, 'Indiekit');
});

test('Gets publication configuration value', t => {
  t.is(indiekit.publication.slugSeparator, '-');
});

test('Sets configuration value', t => {
  indiekit.set('publication.me', 'https://website.example');
  t.is(indiekit.publication.me, 'https://website.example');
});

test('Adds preset', t => {
  const preset = {
    id: 'bar',
    name: 'Bar',
    templatesPath: null
  };
  indiekit.addPreset(preset);
  const {presets} = indiekit.application;
  t.true(presets.some(preset => preset.id === 'bar'));
});

test('Adds endpoint', t => {
  const endpoint = {
    id: 'foo',
    name: 'Foo',
    init: () => {}
  };
  indiekit.addEndpoint(endpoint);
  const {endpoints} = indiekit.application;
  t.true(endpoints.some(endpoint => endpoint.id === 'foo'));
});

test('Adds store', t => {
  const store = {
    id: 'foo',
    name: 'Foo'
  };
  indiekit.addStore(store);
  const {stores} = indiekit.application;
  t.true(stores.some(store => store.id === 'foo'));
});

test('Initiates application', async t => {
  const preset = new Preset();
  indiekit.addPreset(preset);
  indiekit.set('publication.preset', preset);
  indiekit.set('publication.categories', ['foo', 'bar']);
  await indiekit.init();
  t.is(indiekit.publication.postTypes[0].name, 'Foo note');
  t.is(indiekit.publication.categories[0], 'foo');
});
