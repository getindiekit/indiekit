const nock = require('nock');
const test = require('ava');

// Function
const getCategories = require(process.env.PWD + '/app/lib/publication/get-categories.js');

// Tests
test('Returns array if categories provided', async t => {
  const pub = {categories: ['foo', 'bar']};
  const categories = await getCategories(pub);
  t.deepEqual(categories, ['foo', 'bar']);
});

test('Returns empty array if categories not an array', async t => {
  const pub = {categories: {foo: 'bar'}};
  const categories = await getCategories(pub);
  t.deepEqual(categories, []);
});

test('Returns array if url to JSON file provided', async t => {
  const json = ['foo', 'bar'];
  nock('https://foo.bar').get('/categories.json').reply(200, json);
  const pub = {categories: {url: 'https://foo.bar/categories.json'}};
  const categories = await getCategories(pub);
  t.deepEqual(categories, ['foo', 'bar']);
});
