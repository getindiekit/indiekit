const test = require('ava');

const devivePhoto = require(process.env.PWD + '/app/lib/microformats/derive-photo.js');

test('Derives photo from `photo` property', async t => {
  const provided = require('./fixtures/photo-provided');
  const photo = await devivePhoto(provided);
  t.is(photo[0].value, 'sunset.jpg');
});

test('Derives photo from `photo.value` property', async t => {
  const providedValue = require('./fixtures/photo-provided-value');
  const photo = await devivePhoto(providedValue);
  t.is(photo[0].value, 'sunset.jpg');
});

test('Derives photos from `photo` properties', async t => {
  const multipleProvided = require('./fixtures/photo-multiple-provided');
  const photos = await devivePhoto(multipleProvided);
  const result = [{value: 'sunrise.jpg'}, {value: 'sunset.jpg'}];
  t.deepEqual(photos, result);
});

test('Derives photos from `photo.value` properties', async t => {
  const multipleProvidedValue = require('./fixtures/photo-multiple-provided-value');
  const photos = await devivePhoto(multipleProvidedValue);
  const result = [{value: 'sunrise.jpg'}, {value: 'sunset.jpg'}];
  t.deepEqual(photos, result);
});
