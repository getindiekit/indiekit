import test from 'ava';
import dateFns from 'date-fns';
import {getDate} from '../../lib/date.js';

const {isValid, parseISO} = dateFns;

test('`client` option creates UTC datetime', t => {
  const result = getDate('client');
  t.true(isValid(parseISO(result)));
  t.regex(result, /(?<date>\d{4}-[01]\d-[0-3]\d)(T(?<time>[0-2](?:\d:[0-5]){2}\d\.\d+))?(?<timeZone>Z)/);
});

test('`client` option retains short date', t => {
  const result = getDate('client', '2019-01-02');
  t.is(result, '2019-01-02');
});

test('`client` option retains local datetime', t => {
  const result = getDate('client', '2019-01-02T03:04:05.678');
  t.is(result, '2019-01-02T03:04:05.678');
});

test('`client` option retains UTC datetime', t => {
  const result = getDate('client', '2019-01-02T03:04:05.678Z');
  t.is(result, '2019-01-02T03:04:05.678Z');
});

test('`client` option retains offset datetime', t => {
  const result = getDate('client', '2019-01-02T03:04:05.678+09:00');
  t.is(result, '2019-01-02T03:04:05.678+09:00');
});

test('`local` option creates local datetime', t => {
  const result = getDate('local');
  t.true(isValid(parseISO(result)));
  t.regex(result, /(\d{4}-[01]\d-[0-3]\d)T([0-2](?:\d:[0-5]){2}\d\.\d+)$/);
});

test('`local` option expands short date', t => {
  const result = getDate('local', '2019-01-02');
  t.is(result, '2019-01-02T00:00:00.000');
});

test('`local` option retains local datetime', t => {
  const result = getDate('local', '2019-01-02T03:04:05.678');
  t.is(result, '2019-01-01T18:04:05.678');
});

test('`local` option converts UTC to local datetime', t => {
  const result = getDate('local', '2019-01-02T03:04:05.678Z');
  t.is(result, '2019-01-01T18:04:05.678');
});

test('`local` option converts offset to local datetime', t => {
  const result = getDate('local', '2019-01-02T03:04:05.678+09:00');
  t.is(result, '2019-01-01T18:04:05.678');
});

test('`server` option creates server offset datetime', t => {
  const result = getDate('server');
  t.true(isValid(parseISO(result)));
  t.regex(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+\+09:00$/);
});

test('`server` option converts short date to server offset datetime', t => {
  const result = getDate('server', '2019-01-02');
  t.is(result, '2019-01-02T00:00:00.000+09:00');
});

test('`server` option converts local to server offset datetime', t => {
  const result = getDate('server', '2019-01-02T03:04:05.678');
  t.is(result, '2019-01-01T18:04:05.678+09:00');
});

test('`server` option converts UTC to server offset datetime', t => {
  const result = getDate('server', '2019-01-02T03:04:05.678Z');
  t.is(result, '2019-01-02T03:04:05.678+09:00');
});

test('`server` option converts offset to server offset datetime', t => {
  const result = getDate('server', '2019-01-02T03:04:05.678+09:00');
  t.is(result, '2019-01-02T03:04:05.678+09:00');
});

test('`Pacific/Honolulu` option creates UTC -10:00 datetime', t => {
  const result = getDate('Pacific/Honolulu');
  t.true(isValid(parseISO(result)));
  t.regex(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+-10:00$/);
});

test('`Pacific/Honolulu` option converts short date to UTC -10:00 datetime', t => {
  const result = getDate('Pacific/Honolulu', '2019-01-02');
  t.is(result, '2019-01-02T00:00:00.000-10:00');
});

test('`Pacific/Honolulu` option converts local to UTC -10:00 datetime', t => {
  const result = getDate('Pacific/Honolulu', '2019-01-02T03:04:05.678');
  t.is(result, '2019-01-01T18:04:05.678-10:00');
});

test('`Pacific/Honolulu` option converts UTC to UTC -10:00 datetime', t => {
  const result = getDate('Pacific/Honolulu', '2019-01-02T03:04:05.678Z');
  t.is(result, '2019-01-02T03:04:05.678-10:00');
});

test('`Pacific/Honolulu` option converts offset to UTC -10:00 datetime', t => {
  const result = getDate('Pacific/Honolulu', '2019-01-02T03:04:05.678+09:00');
  t.is(result, '2019-01-02T03:04:05.678-10:00');
});

test('`UTC` option creates UTC datetime', t => {
  const result = getDate('UTC');
  t.true(isValid(parseISO(result)));
  t.regex(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+Z$/);
});

test('`UTC` option converts short date to UTC datetime', t => {
  const result = getDate('UTC', '2019-01-02');
  t.is(result, '2019-01-02T00:00:00.000Z');
});

test('`UTC` option converts local to UTC datetime', t => {
  const result = getDate('UTC', '2019-01-02T03:04:05.678');
  t.is(result, '2019-01-01T18:04:05.678Z');
});

test('`UTC` option retains UTC datetime', t => {
  const result = getDate('UTC', '2019-01-02T03:04:05.678Z');
  t.is(result, '2019-01-02T03:04:05.678Z');
});

test('`UTC` option converts offset to UTC datetime', t => {
  const result = getDate('UTC', '2019-01-02T03:04:05.678+09:00');
  t.is(result, '2019-01-02T03:04:05.678Z');
});
