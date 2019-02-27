const test = require('ava');
const {DateTime} = require('luxon');

const dervivePublishedProperty = require('./derive-published-property.js');

test('Derives date from `published` property', t => {
  const publishedProvided = require('./fixtures/published-provided');
  const published = dervivePublishedProperty(publishedProvided);
  t.is(published[0], '2019-01-02T03:04:05.678+00:00');
});

test('Derives date from `published` property with short date', t => {
  const publishedProvidedShortDate = require('./fixtures/published-provided-short-date');
  const published = dervivePublishedProperty(publishedProvidedShortDate);
  t.is(published[0], '2019-01-02T00:00:00.000+00:00');
});

test('Derives date by using current date', t => {
  const publishedMissing = require('./fixtures/published-missing');
  const published = dervivePublishedProperty(publishedMissing);
  t.true(DateTime.fromISO(published[0]).isValid);
});
