import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
import {publication} from '../helpers/publication.js';
import {media} from '../../lib/media.js';
import {mediaData} from '../fixtures/data.js';

test('Uploads a file', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('photo.jpg'))
    .reply(200, {commit: {message: 'Message'}});
  const file = {
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  };
  const result = await media.upload(publication, mediaData, file);
  t.deepEqual(result, {
    location: 'https://website.example/photo.jpg',
    status: 201,
    json: {
      success: 'create',
      success_description: 'Media uploaded to https://website.example/photo.jpg'
    }
  });
  scope.done();
});

test('Throws error uploading a file', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('photo.jpg'))
    .replyWithError('Not found');
  const file = {
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  };
  const error = await t.throwsAsync(
    media.upload(publication, mediaData, file)
  );
  t.regex(error.message, /\bNot found\b/);
  scope.done();
});
