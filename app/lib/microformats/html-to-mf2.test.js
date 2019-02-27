const fs = require('fs');
const path = require('path');
const test = require('ava');

// Function
const htmlToMf2 = require('./html-to-mf2.js');

// Fixtures
const itemsMissing = fs.readFileSync(path.resolve(__dirname, 'fixtures/html-items-none.html'));
const itemsProvided = fs.readFileSync(path.resolve(__dirname, 'fixtures/html-items-many.html'));
const itemMissing = fs.readFileSync(path.resolve(__dirname, 'fixtures/html-item-missing-properties.html'));
const itemContentPlain = fs.readFileSync(path.resolve(__dirname, 'fixtures/html-item-content-plain.html'));
const itemContentEmbedded = fs.readFileSync(path.resolve(__dirname, 'fixtures/html-item-content-embedded.html'));

test('Throws error if HTML has no items', async t => {
  const html = Buffer.from(itemsMissing).toString('utf-8');
  const error = await t.throwsAsync(htmlToMf2(html));
  t.is(error.message, 'Error: Page has no items');
});

test('Throws error if HTML has more than one item', async t => {
  const html = Buffer.from(itemsProvided).toString('utf-8');
  const error = await t.throwsAsync(htmlToMf2(html));
  t.is(error.message, 'Error: Page has more than one item');
});

test('Throws error if item has no properties', async t => {
  const html = Buffer.from(itemMissing).toString('utf-8');
  const error = await t.throwsAsync(htmlToMf2(html));
  t.is(error.message, 'Error: Item has no properties');
});

test('Returns empty object if requested property not found', async t => {
  const html = Buffer.from(itemContentPlain).toString('utf-8');
  const mf2 = await htmlToMf2(html, 'location');
  t.deepEqual(mf2, {});
});

test('Returns requested property', async t => {
  const html = Buffer.from(itemContentPlain).toString('utf-8');
  const name = {
    name: ['I ate a cheese sandwich.']
  };
  const mf2 = await htmlToMf2(html, 'name');
  t.deepEqual(mf2, name);
});

test('Returns requested properties', async t => {
  const html = Buffer.from(itemContentPlain).toString('utf-8');
  const properties = {
    name: ['I ate a cheese sandwich.'],
    published: ['2013-03-07']
  };
  const mf2 = await htmlToMf2(html, ['name', 'published']);
  t.deepEqual(mf2, properties);
});

test('Returns `content.html` property without newlines, carriage returns, tabs or extraneous spaces.', async t => {
  const html = Buffer.from(itemContentEmbedded).toString('utf-8');
  const content = {
    content: [{
      html: '<p>I ate a <em>cheese</em> sandwich.</p>',
      value: 'I ate a cheese sandwich.'
    }]
  };
  const mf2 = await htmlToMf2(html, 'content');
  t.deepEqual(mf2, content);
});
