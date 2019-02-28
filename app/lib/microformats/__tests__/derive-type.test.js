const test = require('ava');

// Function
const derviveType = require('./../derive-type.js');

// Fixtures
const article = require('./fixtures/type-article');
const note = require('./fixtures/type-note');
const photo = require('./fixtures/type-photo');

// Tests
test('Derives article post type from article microformats', t => {
  t.is(derviveType(article), 'article');
});

test('Derives note post type from note microformats', t => {
  t.is(derviveType(note), 'note');
});

test('Derives photo post type from photo microformats', t => {
  t.is(derviveType(photo), 'photo');
});
