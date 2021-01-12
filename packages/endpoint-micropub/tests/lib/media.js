import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {uploadMedia} from '../../lib/media.js';

test.beforeEach(t => {
  t.context = {
    publication: {
      mediaEndpoint: 'https://media-endpoint.example'
    },
    properties: {
      type: 'entry',
      content: ['I ate a cheese sandwich, which was nice.'],
      category: ['foo', 'bar'],
      audio: ['https://website.example/media/sound.mp3']
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

test('Uploads attached file via media endpoint', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(201, t.context.responseBody('photo.jpg'), t.context.responseHeader('photo.jpg'));
  const files = [{
    buffer: getFixture('file-types/photo.jpg', false),
    fieldname: 'photo',
    originalname: 'photo.jpg'
  }];
  const result = await uploadMedia(t.context.publication, t.context.properties, files);
  t.deepEqual(result.photo, ['https://website.example/media/photo.jpg']);
  scope.done();
});

test.serial('Uploads attached files via media endpoint', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(201, t.context.responseBody('photo1.jpg'), t.context.responseHeader('photo1.jpg'))
    .post('/')
    .reply(201, t.context.responseBody('photo2.jpg'), t.context.responseHeader('photo2.jpg'));
  const files = [{
    buffer: getFixture('file-types/photo.jpg', false),
    fieldname: 'photo[]',
    originalname: 'photo1.jpg'
  }, {
    buffer: getFixture('file-types/photo.jpg', false),
    fieldname: 'photo[]',
    originalname: 'photo2.jpg'
  }];
  const result = await uploadMedia(t.context.publication, t.context.properties, files);
  t.deepEqual(result.photo, [
    'https://website.example/media/photo1.jpg',
    'https://website.example/media/photo2.jpg'
  ]);
  scope.done();
});

test.serial('Throws error if no media endpoint URL', async t => {
  const files = [{
    buffer: getFixture('file-types/photo.jpg', false),
    fieldname: 'photo',
    originalname: 'photo.jpg'
  }];
  const error = await t.throwsAsync(
    uploadMedia({}, t.context.properties, files)
  );
  t.is(error.message, 'Missing `url` property');
});

test.serial('Throws error uploading attached file', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(400, {
      error_description: 'The token provided was malformed'
    });
  const files = [{
    buffer: getFixture('file-types/photo.jpg', false),
    fieldname: 'photo',
    originalname: 'photo.jpg'
  }];
  const error = await t.throwsAsync(
    uploadMedia(t.context.publication, t.context.properties, files)
  );
  t.is(error.message, 'The token provided was malformed');
  scope.done();
});
