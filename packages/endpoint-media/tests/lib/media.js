import test from 'ava';
import {getFixture} from '../helpers/fixture.js';
import {JekyllConfig} from '../../../config-jekyll/index.js';
import {GithubStore} from '../../../store-github/index.js';
import {media} from '../../lib/media.js';

const publication = {
  config: new JekyllConfig().config,
  me: 'https://website.example',
  store: new GithubStore({
    token: 'abc123',
    user: 'user',
    repo: 'repo'
  })
};
const mediaData = getFixture('data.js');

test.skip('Uploads a file', async t => {
  const file = {
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  };
  const result = await media.upload(publication, mediaData, file);
  t.log(result);
});
