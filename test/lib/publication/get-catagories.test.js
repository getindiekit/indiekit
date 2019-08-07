const nock = require('nock');
const test = require('ava');

const getCategories = require(process.env.PWD + '/app/lib/publication/get-categories.js');

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

test('Throws error if JSON file provided not found', async t => {
  nock('https://foo.bar').get('/categories.json').reply(404);
  const pub = {categories: {url: 'https://foo.bar/categories.json'}};
  const error = await t.throwsAsync(getCategories(pub));
  t.is(error.message.error, 'FetchError');
});
