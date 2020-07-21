import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
import {uploadMedia} from '../../lib/media.js';

test.beforeEach(t => {
  t.context = {
    publication: {
      config: {
        'media-endpoint': 'https://media-endpoint.example'
      }
    },
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

test('Uploads attached file via media endpoint', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(201, t.context.responseBody('photo.jpg'), t.context.responseHeader('photo.jpg'));
  const files = [{
    buffer: getFixture('photo.jpg', false),
    fieldname: 'photo',
    originalname: 'photo.jpg'
  }];
  const result = await uploadMedia(t.context.publication, t.context.mf2, files);
  t.deepEqual(result.properties.photo, ['https://website.example/media/photo.jpg']);
  scope.done();
});

test.serial('Uploads attached files via media endpoint', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(201, t.context.responseBody('photo1.jpg'), t.context.responseHeader('photo1.jpg'))
    .post('/')
    .reply(201, t.context.responseBody('photo2.jpg'), t.context.responseHeader('photo2.jpg'));
  const files = [{
    buffer: getFixture('photo.jpg', false),
    fieldname: 'photo[]',
    originalname: 'photo1.jpg'
  }, {
    buffer: getFixture('photo.jpg', false),
    fieldname: 'photo[]',
    originalname: 'photo2.jpg'
  }];
  const result = await uploadMedia(t.context.publication, t.context.mf2, files);
  t.deepEqual(result.properties.photo, [
    'https://website.example/media/photo1.jpg',
    'https://website.example/media/photo2.jpg'
  ]);
  scope.done();
});

test.serial('Throws error uploading attached file', async t => {
  const scope = nock('https://media-endpoint.example')
    .post('/')
    .reply(400, {
      error_description: 'The token provided was malformed'
    });
  const files = [{
    buffer: getFixture('photo.jpg', false),
    fieldname: 'photo',
    originalname: 'photo.jpg'
  }];
  const error = await t.throwsAsync(
    uploadMedia(t.context.publication, t.context.mf2, files)
  );
  t.is(error.message, 'The token provided was malformed');
  scope.done();
});
