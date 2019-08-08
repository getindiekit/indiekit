const fs = require('fs-extra');
const test = require('ava');

const outputDir = process.env.PWD + '/.ava_output';

const createCache = require(process.env.PWD + '/app/lib/cache/create.js');
const deleteCache = require(process.env.PWD + '/app/lib/cache/delete.js');

test.beforeEach(async () => {
  await fs.emptyDir(outputDir);
});

test('Deletes cache directory, which exists', t => {
  const cachePath = process.env.PWD + '/.ava_output/delete-1/cache.json';
  createCache(cachePath, '{}');
  deleteCache(cachePath);
  const deleted = !fs.existsSync(cachePath);
  t.is(deleted, true);
});

test('Skips deleting cache directory, as it doesn’t exist', t => {
  const cachePath = process.env.PWD + '/.ava_output/delete-2/cache.json';
  deleteCache(cachePath);
  const deleted = !fs.existsSync(cachePath);
  t.is(deleted, true);
});

test.afterEach(async () => {
  await fs.emptyDir(outputDir);
});
