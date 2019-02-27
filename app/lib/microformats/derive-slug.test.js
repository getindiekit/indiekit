const test = require('ava');

const derviveSlug = require('./derive-slug.js');

test('Derives slug from `mp-slug` property', t => {
  const provided = require('./fixtures/slug-provided');
  const slug = derviveSlug(provided, '-');
  t.is(slug[0], 'made-a-thing');
});

test('Derives slug from `name` property', t => {
  const missing = require('./fixtures/slug-missing');
  const slug = derviveSlug(missing, '-');
  t.is(slug[0], 'made-a-thing-with-javascript-that-works');
});

test('Derives slug by generating random number', t => {
  const missingNoName = require('./fixtures/slug-missing-no-name');
  const slug = derviveSlug(missingNoName, '-');
  t.regex(slug[0], /(\d{5})/g);
});
