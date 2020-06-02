import test from 'ava';

import {date} from '../../filters/date.js';

test('Formats a date', t => {
  t.is(date('2019-11-30', 'DDD'), '30 November 2019');
});

test('Formats the date right now', t => {
  const now = Math.round(new Date().getTime() / 1000000);
  const result = Math.round(date('now', 'X') / 1000);
  t.is(result, now);
});

