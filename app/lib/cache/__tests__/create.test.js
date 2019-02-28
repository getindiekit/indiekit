const fs = require('fs-extra');
const test = require('ava');

const outputDir = process.env.PWD + '/.ava_output';

// Function
const createCache = require('./../create.js');

// Tests
test('Creates cache', t => {
  const cachePath = outputDir + '/create-1/cache.json';
  createCache(cachePath, '{}');
  const created = fs.existsSync(cachePath);
  t.is(created, true);
});
