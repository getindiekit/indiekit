import {JekyllPreset} from '../../packages/preset-jekyll/index.js';
import {GithubStore} from '../../packages/store-github/index.js';

export const publication = {
  config: new JekyllPreset().config,
  me: 'https://website.example',
  media: {
    insertOne: () => {}
  },
  postTemplate(properties) {
    return JSON.stringify(properties);
  },
  store: new GithubStore({
    token: 'abc123',
    user: 'user',
    repo: 'repo'
  }),
  storeMessageTemplate: metaData => {
    return `${metaData.action} ${metaData.postType} ${metaData.fileType}`;
  }
};
