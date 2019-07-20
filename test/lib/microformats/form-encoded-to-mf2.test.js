const test = require('ava');

// Function
const formEncodedToMf2 = require(process.env.PWD + '/app/lib/microformats/form-encoded-to-mf2.js');

// Tests
test('Converts form-encoded request into microformats2 object.', t => {
  const body = {
    h: 'entry',
    content: 'Foo+bar+baz'
  };
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Foo bar baz']
    }
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});

test('Assumes `h-entry` type if no h parameter provided', t => {
  const body = {
    content: 'Foo+bar+baz'
  };
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Foo bar baz']
    }
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});

test('Excludes reserved properties, retains extended properties', t => {
  const body = {
    h: 'entry',
    content: 'Foo+bar+baz',
    access_token: 'abc123', // eslint-disable-line camelcase
    action: 'delete',
    url: 'https://example.com',
    'mp-slug': 'foo-bar',
    'mp-syndicate-to': 'https://socialnetwork.example/user'
  };
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Foo bar baz']
    },
    'mp-slug': ['foo-bar'],
    'mp-syndicate-to': ['https://socialnetwork.example/user']
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});

test('Converts params with square brackets into an array', t => {
  const body = {
    h: 'entry',
    content: 'Foo+bar+baz',
    category: ['test1', 'test2']
  };
  const mf2 = {
    type: ['h-entry'],
    properties: {
      content: ['Foo bar baz'],
      category: ['test1', 'test2']
    }
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});
