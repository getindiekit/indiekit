import test from 'ava';
import luxon from 'luxon';
import {getFixture} from '../helpers/fixture.js';
import {deriveContent, derivePermalink, derivePublishedDate, deriveSlug} from '../../services/properties.js';

const {DateTime} = luxon;

test('Derives content from `content[0].html` property', t => {
  const mf2 = JSON.parse(getFixture('content-provided-html-value.json'));
  const content = deriveContent(mf2);
  t.is(content[0], '<p>Visit this <a href="https://website.example">example website</a>.</p>');
});

test('Derives content from `content[0].html` property (ignores `content.value`)', t => {
  const mf2 = JSON.parse(getFixture('content-provided-html.json'));
  const content = deriveContent(mf2);
  t.is(content[0], '<p>Visit this <a href="https://website.example">example website</a>.</p>');
});

test('Derives content from `content[0].value` property', t => {
  const mf2 = JSON.parse(getFixture('content-provided-value.json'));
  const content = deriveContent(mf2);
  t.is(content[0], 'Visit this example website.');
});

test('Derives content from `content[0]` property', t => {
  const mf2 = JSON.parse(getFixture('content-provided.json'));
  const content = deriveContent(mf2);
  t.is(content[0], 'Visit this example website.');
});

test('Returns null if no `content[0]` property found', t => {
  const mf2 = JSON.parse(getFixture('content-missing.json'));
  const content = deriveContent(mf2);
  t.is(content, null);
});

test('Derives a permalink', t => {
  t.is(derivePermalink('http://foo.bar', 'baz'), 'http://foo.bar/baz');
  t.is(derivePermalink('http://foo.bar/', '/baz'), 'http://foo.bar/baz');
  t.is(derivePermalink('http://foo.bar/baz', '/qux/quux'), 'http://foo.bar/baz/qux/quux');
  t.is(derivePermalink('http://foo.bar/baz/', '/qux/quux'), 'http://foo.bar/baz/qux/quux');
});

test('Derives date from `published` property', t => {
  const mf2 = JSON.parse(getFixture('published-provided.json'));
  const published = derivePublishedDate(mf2);
  t.is(published[0], '2019-01-02T03:04:05.678Z');
});

test('Derives date from `published` property with short date', t => {
  const mf2 = JSON.parse(getFixture('published-provided-short-date.json'));
  const published = derivePublishedDate(mf2);
  t.is(published[0], '2019-01-02T00:00:00.000Z');
});

test('Derives date by using current date', t => {
  const mf2 = JSON.parse(getFixture('published-missing.json'));
  const published = derivePublishedDate(mf2);
  t.true(DateTime.fromISO(published[0]).isValid);
});

test('Derives slug from `mp-slug` property', t => {
  const mf2 = JSON.parse(getFixture('slug-provided.json'));
  const slug = deriveSlug(mf2, '-');
  t.is(slug[0], 'cheese-sandwich');
});

test('Derives slug, ignoring empty `mp-slug` property', t => {
  const mf2 = JSON.parse(getFixture('slug-provided-empty.json'));
  const slug = deriveSlug(mf2, '-');
  t.is(slug[0], 'i-ate-a-cheese-sandwich');
});

test('Derives slug from `name` property', t => {
  const mf2 = JSON.parse(getFixture('slug-missing.json'));
  const slug = deriveSlug(mf2, '-');
  t.is(slug[0], 'i-ate-a-cheese-sandwich');
});

test('Derives slug by generating random number', t => {
  const mf2 = JSON.parse(getFixture('slug-missing-no-name.json'));
  const slug = deriveSlug(mf2, '-');
  t.regex(slug[0], /[\d\w]{5}/g);
});
