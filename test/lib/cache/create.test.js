const fs = require('fs-extra');
const test = require('ava');

const outputDir = process.env.PWD + '/.ava_output/cache-create';

const createCache = require(process.env.PWD + '/app/lib/cache/create.js');

test.skip('Creates cache', t => {
  const cachePath = outputDir + '/create-1/cache.json';
  createCache(cachePath, '{}');
  const created = fs.existsSync(cachePath);
  t.is(created, true);
});
