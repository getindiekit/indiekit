import test from 'ava';
import dateFns from 'date-fns';
import {getDate, getServerTimeZone} from '../../lib/date.js';

const {isValid, parseISO} = dateFns;

test('`client` option creates UTC datetime', t => {
  const result = getDate('client');
  t.true(isValid(parseISO(result)));
  t.regex(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+Z$/);
});

test('`client` option retains short date', t => {
  const result = getDate('client', '2020-01-02');
  t.is(result, '2020-01-02');
});

test('`client` option retains local datetime', t => {
  const result = getDate('client', '2020-01-02T12:00:00.000');
  t.is(result, '2020-01-02T12:00:00.000');
});

test('`client` option retains UTC datetime', t => {
  const result = getDate('client', '2020-01-02T12:00:00.000Z');
  t.is(result, '2020-01-02T12:00:00.000Z');
});

test('`client` option retains offset datetime', t => {
  const result = getDate('client', '2020-01-02T12:00:00.000-04:00');
  t.is(result, '2020-01-02T12:00:00.000-04:00');
});

test('`server` option creates server offset datetime', t => {
  const result = getDate('server');
  t.true(isValid(parseISO(result)));
  t.regex(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+Z|\+01:00$/);
});

test('`server` option converts short date to server offset datetime', t => {
  const result = getDate('server', '2020-01-02');
  t.regex(result, /(2020-01-02T00:00:00\.000)(Z|\+01:00)/);
});

test('`server` option converts local to server offset datetime', t => {
  const result = getDate('server', '2020-01-02T12:00:00.000');
  t.regex(result, /(2020-01-02T(12|13):00:00\.000)(Z|\+01:00)/);
});

test('`server` option converts UTC to server offset datetime', t => {
  const result = getDate('server', '2020-01-02T12:00:00.000Z');
  t.regex(result, /(2020-01-02T(12|13):00:00\.000)(Z|\+01:00)/);
});

test('`server` option converts offset datetime', t => {
  const result = getDate('server', '2020-01-02T12:00:00.000-04:00');
  t.regex(result, /(2020-01-02T(16|17):00:00\.000)(Z|\+01:00)/);
});

test('`Asia/Taipei` option creates +08:00 offset datetime', t => {
  const result = getDate('Asia/Taipei');
  t.true(isValid(parseISO(result)));
  t.regex(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+\+08:00$/);
});

test('`Asia/Taipei` option converts short date to +08:00 offset datetime', t => {
  const result = getDate('Asia/Taipei', '2020-01-02');
  t.is(result, '2020-01-02T00:00:00.000+08:00');
});

test('`Asia/Taipei` option converts local to +08:00 offset datetime', t => {
  const result = getDate('Asia/Taipei', '2020-01-02T12:00:00.000');
  t.is(result, '2020-01-02T20:00:00.000+08:00');
});

test('`Asia/Taipei` option converts UTC to +08:00 offset datetime', t => {
  const result = getDate('Asia/Taipei', '2020-01-02T12:00:00.000Z');
  t.is(result, '2020-01-02T20:00:00.000+08:00');
});

test('`Asia/Taipei` option converts offset to +08:00 offset datetime', t => {
  const result = getDate('Asia/Taipei', '2020-01-02T12:00:00.000-04:00');
  t.is(result, '2020-01-03T00:00:00.000+08:00');
});

test('`UTC` option creates Z offset datetime', t => {
  const result = getDate('UTC');
  t.true(isValid(parseISO(result)));
  t.regex(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+Z$/);
});

test('`UTC` option converts short date to Z offset datetime', t => {
  const result = getDate('UTC', '2020-01-02');
  t.is(result, '2020-01-02T00:00:00.000Z');
});

test('`UTC` option converts local to Z offset datetime', t => {
  const result = getDate('UTC', '2020-01-02T12:00:00.000');
  t.is(result, '2020-01-02T12:00:00.000Z');
});

test('`UTC` option retains Z offset datetime', t => {
  const result = getDate('UTC', '2020-01-02T12:00:00.000Z');
  t.is(result, '2020-01-02T12:00:00.000Z');
});

test('`UTC` option converts offset date to Z offset datetime', t => {
  const result = getDate('UTC', '2020-01-02T12:00:00-04:00');
  t.is(result, '2020-01-02T16:00:00.000Z');
});

test('`UTC` option converts offset to Z offset datetime', t => {
  const result = getDate('UTC', '2020-01-02T12:00:00.000-04:00');
  t.is(result, '2020-01-02T16:00:00.000Z');
});

test('Gets server timezone offset', t => {
  process.env.TZ = 'Asia/Taipei';
  const ahead = getServerTimeZone();
  t.is(ahead, '+08:00');

  process.env.TZ = 'America/Los_Angeles';
  const behind = getServerTimeZone();
  t.is(behind, '-08:00');

  process.env.TZ = 'UTC';
  const utc = getServerTimeZone();
  t.is(utc, 'Z');
});
