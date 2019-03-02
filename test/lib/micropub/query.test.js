const test = require('ava');

// Function
const query = require(process.env.PWD + '/app/lib/micropub/query');

// Setup
const request = {
  protocol: 'https',
  headers: {
    host: 'indiekit.test'
  }
};

// Tests
test('Returns configuration object', async t => {
  request.query = {
    q: 'config'
  };
  const config = require('./fixtures/query-config');
  const expected = {
    'media-endpoint': 'https://indiekit.test/media',
    'syndicate-to': config['syndicate-to'],
    'post-types': []
  };
  const response = await query(request, config);
  t.is(response.code, 200);
  t.deepEqual(response.body, expected);
});

test('Returns configuration object with third-party media endpoint', async t => {
  request.query = {q: 'config'};
  const config = require('./fixtures/query-config-media-endpoint');
  const expected = {
    'media-endpoint': config['media-endpoint'],
    'syndicate-to': config['syndicate-to'],
    'post-types': []
  };
  const response = await query(request, config);
  t.is(response.code, 200);
  t.deepEqual(response.body, expected);
});

test('Returns source content object', async t => {
  request.query = {
    q: 'source',
    url: 'https://paulrobertlloyd.com/2018/11/warp_and_weft'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(request, config);
  t.is(response.code, 200);
  t.is(response.body.properties.name[0], 'Warp and Weft');
});

test('Throws error if source content has no microformats data', async t => {
  request.query = {
    q: 'source',
    url: 'https://paulrobertlloyd.com'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(request, config);
  t.is(response.code, 400);
  t.is(response.body.error_description, 'Error: Page has no items');
});

test('Returns syndication targets object', async t => {
  request.query = {
    q: 'syndicate-to'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const expected = {
    'syndicate-to': config['syndicate-to']
  };
  const response = await query(request, config);
  t.is(response.code, 200);
  t.deepEqual(response.body, expected);
});

test('Throws error if unknown query value provided', async t => {
  request.query = {
    q: 'foobar'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(request, config);
  t.is(response.code, 400);
});

test('Throws error if unknown parameter provided', async t => {
  request.query = {
    foo: 'bar'
  };
  const config = require('./fixtures/query-config-media-endpoint');
  const response = await query(request, config);
  t.is(response.code, 400);
});
