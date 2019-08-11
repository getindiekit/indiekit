const test = require('ava');
const {DateTime} = require('luxon');

const dervivePublished = require(process.env.PWD + '/lib/microformats/derive-published.js');

test('Derives date from `published` property', t => {
  const provided = require('./fixtures/published-provided');
  const published = dervivePublished(provided);
  t.is(published[0], '2019-01-02T03:04:05.678+00:00');
});

test('Derives date from `published` property with short date', t => {
  const providedShortDate = require('./fixtures/published-provided-short-date');
  const published = dervivePublished(providedShortDate);
  t.is(published[0], '2019-01-02T00:00:00.000+00:00');
});

test('Derives date by using current date', t => {
  const missing = require('./fixtures/published-missing');
  const published = dervivePublished(missing);
  t.true(DateTime.fromISO(published[0]).isValid);
});
