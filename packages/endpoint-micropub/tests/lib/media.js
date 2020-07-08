import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
import {
  addMediaLocations,
  getMediaType,
  uploadMedia
} from '../../lib/media.js';

test.beforeEach(t => {
  t.context = {
    mediaEndpoint: 'https://media-endpoint.example',
    mf2: {
      type: ['h-entry'],
      properties: {
        content: ['I ate a cheese sandwich.'],
        category: ['foo', 'bar'],
        audio: ['https://website.example/media/sound.mp3']
      }
    },
    responseBody: filename => ({
      location: `https://website.example/media/${filename}`,
      status: 201,
      success: 'create',
      description: `https://website.example/media/${filename}`,
      type: 'photo'
    }),
    responseHeader: filename => ({
      location: `https://website.example/media/${filename}`
    })
  };
});

test('Updates Microformats2 with location of uploaded media', t => {
  const result = addMediaLocations(t.context.mf2, [
    'https://website.example/media/photo.jpg'
  ]);
  t.deepEqual(result.properties.photo, [
    'https://website.example/media/photo.jpg'
  ]);
});

test('Updates Microformats2 with locations of uploaded media', t => {
  const result = addMediaLocations(t.context.mf2, [
    'https://website.example/media/audio.mp3',
    'https://website.example/media/photo.jpg'
  ]);
  t.deepEqual(result.properties.audio, [
    'https://website.example/media/sound.mp3',
    'https://website.example/media/audio.mp3'
  ]);
  t.deepEqual(result.properties.photo, [
    'https://website.example/media/photo.jpg'
  ]);
  t.falsy(result.properties.video);
});

test('Gets media type (and return equivalent IndieWeb post type)', t => {
  const audio = getMediaType('audio.mp3');
  const photo = getMediaType('photo.jpg');
  const video = getMediaType('video.mp4');
  t.is(audio, 'audio');
  t.is(photo, 'photo');
  t.is(video, 'video');
});

test('Uploads attached file via media endpoint', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(201, t.context.responseBody('photo.jpg'), t.context.responseHeader('photo.jpg'));
  const files = [{
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  }];
  const result = await uploadMedia(t.context.mediaEndpoint, files);
  t.deepEqual(result, ['https://website.example/media/photo.jpg']);
  scope.done();
});

test('Uploads attached files via media endpoint', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(201, t.context.responseBody('photo1.jpg'), t.context.responseHeader('photo1.jpg'))
    .post('/')
    .reply(201, t.context.responseBody('photo2.jpg'), t.context.responseHeader('photo2.jpg'));
  const files = [{
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo1.jpg'
  }, {
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo2.jpg'
  }];
  const result = await uploadMedia(t.context.mediaEndpoint, files);
  t.deepEqual(result, [
    'https://website.example/media/photo1.jpg',
    'https://website.example/media/photo2.jpg'
  ]);
  scope.done();
});

test('Throws error uploading attached file', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(400, {
      error_description: 'The token provided was malformed' // eslint-disable-line camelcase
    });
  const files = [{
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  }];
  const error = await t.throwsAsync(
    uploadMedia(t.context.mediaEndpoint, files)
  );
  t.is(error.message, 'The token provided was malformed');
  scope.done();
});
