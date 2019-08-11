const test = require('ava');

const urlToMf2 = require(process.env.PWD + '/lib/microformats/url-to-mf2.js');

test('Throws error if URL has no items', async t => {
  const url = 'https://paulrobertlloyd.com';
  const error = await t.throwsAsync(urlToMf2(url));
  t.is(error.message.error_description, 'Page has no items');
});

test('Throws error if no response from URL', async t => {
  const url = 'https://example.example';
  const error = await t.throwsAsync(urlToMf2(url));
  t.is(error.message.error, 'Not found');
});

test('Returns empty object if requested property not found', async t => {
  const url = 'https://paulrobertlloyd.com/notes/1550837320';
  const mf2 = await urlToMf2(url, 'location');
  t.deepEqual(mf2, {});
});

test('Returns requested property', async t => {
  const url = 'https://paulrobertlloyd.com/2018/11/warp_and_weft';
  const name = {
    name: ['Warp and Weft']
  };
  const mf2 = await urlToMf2(url, 'name');
  t.deepEqual(mf2, name);
});
