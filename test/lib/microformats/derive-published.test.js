const test = require('ava');
const {DateTime} = require('luxon');

// Function
const dervivePublished = require(process.env.PWD + '/app/lib/microformats/derive-published.js');

// Fixtures
const provided = require('./fixtures/published-provided');
const providedShortDate = require('./fixtures/published-provided-short-date');
const missing = require('./fixtures/published-missing');

// Tests
test('Derives date from `published` property', t => {
  const published = dervivePublished(provided);
  t.is(published[0], '2019-01-02T04:04:05.678+01:00');
});

test('Derives date from `published` property with short date', t => {
  const published = dervivePublished(providedShortDate);
  t.is(published[0], '2019-01-02T00:00:00.000+01:00');
});

test('Derives date by using current date', t => {
  const published = dervivePublished(missing);
  t.true(DateTime.fromISO(published[0]).isValid);
});
