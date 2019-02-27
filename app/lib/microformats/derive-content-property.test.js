const test = require('ava');

const derviveContentProperty = require('./derive-content-property.js');

test('Derives content from `content[0].html` property', t => {
  const providedHtmlValue = require('./fixtures/content-provided-html-value');
  const content = derviveContentProperty(providedHtmlValue);
  t.is(content[0], '<p>Visit this <a href="https://example.com/">example website</a>.</p>');
});

test('Derives content from `content[0].html` property (ignores `content.value`)', t => {
  const providedHtml = require('./fixtures/content-provided-html');
  const content = derviveContentProperty(providedHtml);
  t.is(content[0], '<p>Visit this <a href="https://example.com/">example website</a>.</p>');
});

test('Derives content from `content[0].value` property', t => {
  const providedValue = require('./fixtures/content-provided-value');
  const content = derviveContentProperty(providedValue);
  t.is(content[0], 'Visit this example website.');
});

test('Derives content from `content[0]` property', t => {
  const provided = require('./fixtures/content-provided');
  const content = derviveContentProperty(provided);
  t.is(content[0], 'Visit this example website.');
});

test('Returns null if no `content[0]` property found', t => {
  const missing = require('./fixtures/content-missing');
  const content = derviveContentProperty(missing);
  t.is(content, null);
});
