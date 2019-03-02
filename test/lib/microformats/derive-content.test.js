const test = require('ava');

// Function
const derviveContent = require(process.env.PWD + '/app/lib/microformats/derive-content.js');

// Fixtures
const providedHtmlValue = require('./fixtures/content-provided-html-value');
const providedHtml = require('./fixtures/content-provided-html');
const providedValue = require('./fixtures/content-provided-value');
const provided = require('./fixtures/content-provided');
const missing = require('./fixtures/content-missing');

// Tests
test('Derives content from `content[0].html` property', t => {
  const content = derviveContent(providedHtmlValue);
  t.is(content[0], '<p>Visit this <a href="https://example.com/">example website</a>.</p>');
});

test('Derives content from `content[0].html` property (ignores `content.value`)', t => {
  const content = derviveContent(providedHtml);
  t.is(content[0], '<p>Visit this <a href="https://example.com/">example website</a>.</p>');
});

test('Derives content from `content[0].value` property', t => {
  const content = derviveContent(providedValue);
  t.is(content[0], 'Visit this example website.');
});

test('Derives content from `content[0]` property', t => {
  const content = derviveContent(provided);
  t.is(content[0], 'Visit this example website.');
});

test('Returns null if no `content[0]` property found', t => {
  const content = derviveContent(missing);
  t.is(content, null);
});
