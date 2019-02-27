const test = require('ava');

const derviveSlug = require('./derive-slug.js');

test('Derives slug from `mp-slug` property', t => {
  const slugProvided = require('./fixtures/slug-provided');
  const slug = derviveSlug(slugProvided, '-');
  t.is(slug[0], 'made-a-thing');
});

test('Derives slug from `name` property', t => {
  const slugMissing = require('./fixtures/slug-missing');
  const slug = derviveSlug(slugMissing, '-');
  t.is(slug[0], 'made-a-thing-with-javascript-that-works');
});

test('Derives slug by generating random number', t => {
  const slugMissingNoName = require('./fixtures/slug-missing-no-name');
  const slug = derviveSlug(slugMissingNoName, '-');
  t.regex(slug[0], /(\d{5})/g);
});
