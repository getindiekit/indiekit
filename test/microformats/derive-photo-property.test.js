const fs = require('fs');
const path = require('path');
const nock = require('nock');
const test = require('ava');

// Function
const devivePhoto = require(process.env.PWD + '/app/lib/microformats/derive-photo.js');

// Fixtures
const provided = require('./fixtures/photo-provided');
const providedValue = require('./fixtures/photo-provided-value');
const multipleProvided = require('./fixtures/photo-multiple-provided');
const multipleProvidedValue = require('./fixtures/photo-multiple-provided-value');
const missing = require('./fixtures/photo-missing');

// Tests
test('Derives photo from `photo` property', async t => {
  const photo = await devivePhoto(provided);
  t.is(photo[0].value, 'sunset.jpg');
});

test('Derives photo from `photo.value` property', async t => {
  const photo = await devivePhoto(providedValue);
  t.is(photo[0].value, 'sunset.jpg');
});

test('Derives photos from `photo` properties', async t => {
  const photos = await devivePhoto(multipleProvided);
  const mf2 = [{value: 'sunrise.jpg'}, {value: 'sunset.jpg'}];
  t.deepEqual(photos, mf2);
});

test('Derives photos from `photo.value` properties', async t => {
  const photos = await devivePhoto(multipleProvidedValue);
  const mf2 = [{value: 'sunrise.jpg'}, {value: 'sunset.jpg'}];
  t.deepEqual(photos, mf2);
});

test('Derives photo from attached file', async t => {
  const photo1 = fs.readFileSync(path.resolve(__dirname, 'fixtures/photo1.gif'));
  const files = [{
    buffer: Buffer.from(photo1),
    originalname: 'photo1.gif'
  }];
  const typeConfig = {
    file: '{{ filename }}'
  };
  nock('https://api.github.com').persist().put(/\d{2}.gif$/).reply(200);
  const photo = await devivePhoto(null, files, typeConfig);
  t.is(photo[0].value, '01.gif');
});

test('Derives photos from attached files', async t => {
  const photo1 = fs.readFileSync(path.resolve(__dirname, 'fixtures/photo1.gif'));
  const photo2 = fs.readFileSync(path.resolve(__dirname, 'fixtures/photo2.gif'));
  const files = [{
    buffer: Buffer.from(photo1),
    originalname: 'photo1.gif'
  }, {
    buffer: Buffer.from(photo2),
    originalname: 'photo2.gif'
  }];
  const typeConfig = {
    file: '{{ filename }}'
  };
  nock('https://api.github.com').persist().put(/\d{2}.gif$/).reply(200);
  const photos = await devivePhoto(null, files, typeConfig);
  const mf2 = [{value: '01.gif'}, {value: '02.gif'}];
  t.deepEqual(photos, mf2);
});

test('Derives photos from referenced and attached files', async t => {
  const attached = fs.readFileSync(path.resolve(__dirname, 'fixtures/photo1.gif'));
  const files = [{
    buffer: Buffer.from(attached),
    originalname: 'photo1.gif'
  }];
  const typeConfig = {
    file: '{{ filename }}'
  };
  nock('https://api.github.com').persist().put(/\d{2}.gif$/).reply(200);
  const photos = await devivePhoto(provided, files, typeConfig);
  const mf2 = [{value: 'sunset.jpg'}, {value: '01.gif'}];
  t.deepEqual(photos, mf2);
});

test('Returns empty array if no `photo` property found', async t => {
  const photo = await devivePhoto(missing);
  t.deepEqual(photo, []);
});
