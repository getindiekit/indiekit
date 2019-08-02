const test = require('ava');

const formEncodedToMf2 = require(process.env.PWD + '/lib/microformats/form-encoded-to-mf2.js');

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
    access_token: 'abc123',
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

test('Converts `photo` value into mf2 object', t => {
  const body = {
    h: 'entry',
    photo: 'foo.gif'
  };
  const mf2 = {
    type: ['h-entry'],
    properties: {
      photo: [{
        value: 'foo.gif'
      }]
    }
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});

test('Converts `photo` values into mf2 object', t => {
  const body = {
    h: 'entry',
    photo: ['foo.gif', 'bar.jpg']
  };
  const mf2 = {
    type: ['h-entry'],
    properties: {
      photo: [{
        value: 'foo.gif'
      }, {
        value: 'bar.jpg'
      }]
    }
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});

test('Converts `mp-photo-alt` value into mf2 object', t => {
  const body = {
    h: 'entry',
    'mp-photo-alt': 'foo'
  };
  const mf2 = {
    type: ['h-entry'],
    'mp-photo-alt': [{
      alt: 'foo'
    }]
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});

test('Converts `mp-photo-alt` values into mf2 object', t => {
  const body = {
    h: 'entry',
    'mp-photo-alt': ['foo', 'bar']
  };
  const mf2 = {
    type: ['h-entry'],
    'mp-photo-alt': [{
      alt: 'foo'
    }, {
      alt: 'bar'
    }]
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});

test('Merges mf2.properties.photo with mf2[\'mp-photo-alt\']', t => {
  const body = {
    h: 'entry',
    photo: ['foo.gif', 'bar.jpg'],
    'mp-photo-alt': ['foo', 'bar']
  };
  const mf2 = {
    type: ['h-entry'],
    properties: {
      photo: [{
        value: 'foo.gif',
        alt: 'foo'
      }, {
        value: 'bar.jpg',
        alt: 'bar'
      }]
    }
  };
  t.deepEqual(formEncodedToMf2(body), mf2);
});
