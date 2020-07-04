import test from 'ava';
import nock from 'nock';
import {getFixture} from '../helpers/fixture.js';
import {JekyllConfig} from '../../../config-jekyll/index.js';
import {GithubStore} from '../../../store-github/index.js';
import {media} from '../../lib/media.js';
import {mediaData} from '../fixtures/data.js';

const publication = {
  config: new JekyllConfig().config,
  me: 'https://website.example',
  store: new GithubStore({
    token: 'abc123',
    user: 'user',
    repo: 'repo'
  }),
  media: {
    set: () => {}
  }
};

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
    success: 'create',
    description: 'Media uploaded to https://website.example/photo.jpg',
    type: 'photo'
  });
  scope.done();
});

test('Throws error uploading a file', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('photo.jpg'))
    .replyWithError('not found');
  const file = {
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  };
  const error = await t.throwsAsync(
    media.upload(publication, mediaData, file)
  );
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});
