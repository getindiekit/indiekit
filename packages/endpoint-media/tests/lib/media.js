import test from 'ava';
import {getFixture} from '../helpers/fixture.js';
import {JekyllConfig} from '../../../config-jekyll/index.js';
import {GithubStore} from '../../../store-github/index.js';
import {Media} from '../../lib/media.js';

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
const media = new Media(publication, mediaData);

test.skip('Uploads a file', async t => {
  const file = {
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  };
  const result = await media.upload(file);
  t.log(result);
});
