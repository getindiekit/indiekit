const fs = require('fs');
const path = require('path');

const {DateTime} = require('luxon');
const test = require('ava');

// Functions
const utils = require(process.env.PWD + '/app/lib/utils');

// Tests
test('Generates random alpha-numeric string, 5 characters long', t => {
  t.regex(utils.createRandomString(), /[\d\w]{5}/g);
});

test('Derives file properties', async t => {
  let file = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/photo.jpg')),
    originalname: 'photo.jpg'
  };
  file = utils.deriveFileProperties(file);
  t.is(file.originalname, 'photo.jpg');
  t.truthy(DateTime.fromISO(file.filedate.isValid));
  t.regex(file.filename, /[\d\w]{5}.jpg/g);
  t.is(file.fileext, 'jpg');
});

test('Decodes form-encoded string', t => {
  t.false(utils.decodeFormEncodedString({foo: 'bar'}));
  t.is(utils.decodeFormEncodedString('foo+bar'), 'foo bar');
  t.is(utils.decodeFormEncodedString('http%3A%2F%2Ffoo.bar'), 'http://foo.bar');
});

test('Derives file type and returns equivalent IndieWeb post type', async t => {
  const audio = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/audio.mp3'))
  };
  const video = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/video.mp4'))
  };
  const photo = {
    buffer: await fs.readFileSync(path.resolve(__dirname, 'fixtures/photo.jpg'))
  };

  t.is(utils.deriveMediaType(audio), 'audio');
  t.is(utils.deriveMediaType(video), 'video');
  t.is(utils.deriveMediaType(photo), 'photo');
});

test('Excerpts string', t => {
  const string = 'Foo bar baz qux quux.';
  t.is(utils.excerptString(string, 2), 'Foo bar');
  t.is(utils.excerptString(string, 10), 'Foo bar baz qux quux.');
});

test('Removes `/` from beginning and end of string', t => {
  t.is(utils.normalizePath('/foo/bar/'), 'foo/bar');
});

test('Removes `https://`` from beginning of URL', t => {
  t.is(utils.normalizeUrl('https://foo/bar/'), 'foo/bar/');
});
