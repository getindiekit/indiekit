const test = require('ava');

// Function
const query = require('./../query');

// Tests
test('Returns configuration object with media endpoint', async t => {
  const params = {q: 'config'};
  const config = require('./fixtures/query-config');
  const expected = {
    'media-endpoint': 'https://indiekit.test/media',
    'syndicate-to': config['syndicate-to']
  };
  const response = await query(params, config, 'https://indiekit.test');
  t.is(response.code, 200);
  t.deepEqual(response.body, expected);
});

test('Returns configuration object with third-party media endpoint', async t => {
  const params = {q: 'config'};
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(params, config, 'https://indiekit.test');
  t.is(response.code, 200);
  t.deepEqual(response.body, config);
});

test('Returns source content object', async t => {
  const params = {
    q: 'source',
    url: 'https://paulrobertlloyd.com/2018/11/warp_and_weft'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(params, config, 'https://indiekit.test');
  t.is(response.code, 200);
  t.is(response.body.properties.name[0], 'Warp and Weft');
});

test('Throws error if source content has no microformats data', async t => {
  const params = {
    q: 'source',
    url: 'https://paulrobertlloyd.com'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(params, config, 'https://indiekit.test');
  t.is(response.code, 400);
  t.is(response.body.error_description, 'Error: Page has no items');
});

test('Returns syndication targets object', async t => {
  const params = {q: 'syndicate-to'};
  const config = require('./fixtures/query-config-media-endpoint');
  const expected = {
    'syndicate-to': config['syndicate-to']
  };
  const response = await query(params, config, 'https://indiekit.test');
  t.is(response.code, 200);
  t.deepEqual(response.body, expected);
});

test('Throws error if unknown query value provided', async t => {
  const params = {
    q: 'foobar'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(params, config, 'https://indiekit.test');
  t.is(response.code, 400);
});

test('Throws error if unknown parameter provided', async t => {
  const params = {
    foo: 'bar'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(params, config, 'https://indiekit.test');
  t.is(response.code, 400);
});
