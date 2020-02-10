const fs = require('fs');
const path = require('path');

const {DateTime} = require('luxon');
const test = require('ava');

const utils = require(process.env.PWD + '/lib/utils');

test('Removes falsey values if provided object is an array', t => {
  // Setup
  const obj = [1, null, 2, undefined, 3, false, ''];
  const result = [1, 2, 3];

  // Test assertions
  t.deepEqual(utils.cleanArray(obj), result);
});

test('Recursively removes empty, null and falsy values from an object', t => {
  // Setup
  const obj = {
    array: [1, null, 2, undefined, 3, false],
    key: 'value',
    empty: '',
    true: true,
    false: false,
    null: null,
    undefined,
    object: {
      key: 'value',
      empty: '',
      true: true,
      false: false,
      null: null,
      undefined,
      nested: {
        key: 'value',
        empty: '',
        true: true,
        false: false,
        null: null,
        undefined
      }
    }
  };
  const result = {
    array: [1, 2, 3],
    key: 'value',
    true: true,
    object: {
      key: 'value',
      true: true,
      nested: {
        key: 'value',
        true: true
      }
    }
  };

  // Test assertions
  t.deepEqual(utils.cleanObject(obj), result);
});

test('Generates random alpha-numeric string, 5 characters long', t => {
  t.regex(utils.createRandomString(), /[\d\w]{5}/g);
});

test('Decodes form-encoded string', t => {
  t.false(utils.decodeFormEncodedString({foo: 'bar'}));
  t.is(utils.decodeFormEncodedString('foo+bar'), 'foo bar');
  t.is(utils.decodeFormEncodedString('http%3A%2F%2Ffoo.bar'), 'http://foo.bar');
});

test('Derives file properties', async t => {
  // Setup
  let file = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/photo.jpg')),
    originalname: 'photo.jpg'
  };
  file = await utils.deriveFileProperties(file);

  // Test assertions
  t.is(file.originalname, 'photo.jpg');
  t.truthy(DateTime.fromISO(file.filedate.isValid));
  t.regex(file.filename, /[\d\w]{5}.jpg/g);
  t.is(file.fileext, 'jpg');
});

test('Derives file type and returns equivalent IndieWeb post type', async t => {
  // Setup
  const audio = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/audio.mp3'))
  };
  const photo = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/photo.jpg'))
  };
  const video = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/video.mp4'))
  };
  const font = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/font.ttf'))
  };

  // Test assertions
  t.is(await utils.deriveMediaType(audio), 'audio');
  t.is(await utils.deriveMediaType(photo), 'photo');
  t.is(await utils.deriveMediaType(video), 'video');
  t.is(await utils.deriveMediaType(font), null);
});

test('Derives a permalink', t => {
  t.is(utils.derivePermalink('http://foo.bar', 'baz'), 'http://foo.bar/baz');
  t.is(utils.derivePermalink('http://foo.bar/', '/baz'), 'http://foo.bar/baz');
  t.is(utils.derivePermalink('http://foo.bar/baz', '/qux/quux'), 'http://foo.bar/baz/qux/quux');
  t.is(utils.derivePermalink('http://foo.bar/baz/', '/qux/quux'), 'http://foo.bar/baz/qux/quux');
});

test('Excerpts string', t => {
  // Setup
  const string = 'Foo bar baz qux quux.';

  // Test assertions
  t.is(utils.excerptString(string, 2), 'Foo bar');
  t.is(utils.excerptString(string, 10), 'Foo bar baz qux quux.');
  t.is(utils.excerptString({string}, 2), null);
});

test('Removes `/` from beginning and end of string', t => {
  t.is(utils.normalizePath('/foo/bar/'), 'foo/bar');
});

test('Replaces entries of a property', t => {
  const obj = {
    content: ['hello world'],
    summary: ['used to illustrate the syntax of a programming language.']
  };
  const replacements = {
    content: ['hello moon']
  };
  const result = {
    content: ['hello moon'],
    summary: ['used to illustrate the syntax of a programming language.']
  };
  t.deepEqual(utils.replaceEntries(obj, replacements), result);
});

test('Replaces entries of a property, adding properties that don’t exist', t => {
  const obj = {
    content: ['hello world']
  };
  const replacements = {
    summary: ['used to illustrate the syntax of a programming language.']
  };
  const result = {
    content: ['hello world'],
    summary: ['used to illustrate the syntax of a programming language.']
  };
  t.deepEqual(utils.replaceEntries(obj, replacements), result);
});

test('Adds properties to an object', t => {
  const obj = {
    content: ['hello world']
  };
  const additions = {
    syndication: ['http://example.example']
  };
  const result = {
    content: ['hello world'],
    syndication: ['http://example.example']
  };
  t.deepEqual(utils.addProperties(obj, additions), result);
});

test('Adds properties to an existing object', t => {
  const obj = {
    content: ['hello world'],
    category: ['test1']
  };
  const additions = {
    category: ['test2']
  };
  const result = {
    content: ['hello world'],
    category: ['test1', 'test2']
  };
  t.deepEqual(utils.addProperties(obj, additions), result);
});

test('Deletes properties of an object', t => {
  const obj = {
    content: ['hello world'],
    summary: ['used to illustrate the syntax of a programming language.'],
    category: ['foo', 'bar']
  };
  const deletions = ['summary', 'category'];
  const result = {
    content: ['hello world']
  };
  t.deepEqual(utils.deleteProperties(obj, deletions), result);
});

test('Deletes entries of a property', t => {
  const obj = {
    content: ['hello world'],
    category: ['foo', 'bar']
  };
  const deletions = {
    category: ['foo']
  };
  const result = {
    content: ['hello world'],
    category: ['bar']
  };
  t.deepEqual(utils.deleteEntries(obj, deletions), result);
});

test('Deletes entries of a property, removing property if all entries removed', t => {
  const obj = {
    content: ['hello world'],
    category: ['foo', 'bar']
  };
  const deletions = {
    category: ['foo', 'bar']
  };
  const result = {
    content: ['hello world']
  };
  t.deepEqual(utils.deleteEntries(obj, deletions), result);
});

test('Throws error if deleted properties is not an array', t => {
  const obj = {
    content: ['hello world'],
    category: ['foo', 'bar']
  };
  const deletions = {
    category: 'foo'
  };
  const error = t.throws(() => {
    utils.deleteEntries(obj, deletions);
  });
  t.is(error.message, 'category should be an array');
});

test('Ignores properties that don’t exist in target object', t => {
  const obj = {
    content: ['hello world'],
    category: ['foo', 'bar']
  };
  const deletions = {
    content: ['hello world'],
    tags: ['foo', 'bar']
  };
  const result = {
    category: ['foo', 'bar']
  };
  t.deepEqual(utils.deleteEntries(obj, deletions), result);
});
