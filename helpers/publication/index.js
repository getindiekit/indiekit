import process from 'node:process';
import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {GithubStore} from '../../packages/store-github/index.js';
import {JekyllPreset} from '../../packages/preset-jekyll/index.js';

export const publication = {
  categories: `${process.env.TEST_PUBLICATION_URL}categories.json`,
  me: process.env.TEST_PUBLICATION_URL,
  postTemplate(properties) {
    return JSON.stringify(properties);
  },
  store: new GithubStore({
    token: 'abc123',
    user: 'user',
    repo: 'repo',
  }),
  storeMessageTemplate: metaData => `${metaData.action} ${metaData.postType} ${metaData.fileType}`,
  preset: new JekyllPreset(),
};
