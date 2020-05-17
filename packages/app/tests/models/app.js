import test from 'ava';

import {client} from '../../config/app.js';
import * as app from '../../models/app.js';

test.afterEach(() => {
  client.flushall();
});

test('Gets a value from application database', async t => {
  const result = await app.get('name');
  t.is(result, 'IndieKit');
});

test('Gets all values from application database', async t => {
  const result = await app.getAll();
  t.is(result.name, 'IndieKit');
});

test('Sets a value in application database', async t => {
  await app.set('locale', 'de');
  const result = await app.get('locale');

  t.is(result, 'de');
});

test('Sets all values in application database', async t => {
  await app.setAll({
    locale: 'de',
    themeColor: '#f00'
  });
  const result = await app.getAll();
  t.is(result.locale, 'de');
  t.is(result.themeColor, '#f00');
});
