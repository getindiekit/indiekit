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

test('Initiates application', async t => {
  const preset = new Preset();
  indiekit.set('publication.preset', preset);
  indiekit.set('publication.categories', ['foo', 'bar']);
  await indiekit.init();
  t.is(indiekit.publication.postTypes[0].name, 'Foo note');
  t.is(indiekit.publication.categories[0], 'foo');
});
