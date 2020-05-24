import test from 'ava';

import {client} from '../../config/db.js';
import * as publicationModel from '../../models/publication.js';

test.afterEach(() => {
  client.flushall();
});

test('Gets a value', async t => {
  await publicationModel.set('foo', 'pub-bar');
  const result = await publicationModel.get('foo');
  t.is(result, 'pub-bar');
});

test('Gets all values', async t => {
  await publicationModel.set('foo', 'pub-bar');
  const result = await publicationModel.getAll();
  t.is(result.foo, 'pub-bar');
});

test('Sets a value', async t => {
  await publicationModel.set('foo', 'pub-bar');
  const result = await publicationModel.get('foo');

  t.is(result, 'pub-bar');
});

test('Sets all values', async t => {
  await publicationModel.setAll({
    foo: 'pub-bar',
    baz: 'pub-qux'
  });
  const result = await publicationModel.getAll();
  t.is(result.foo, 'pub-bar');
  t.is(result.baz, 'pub-qux');
});
