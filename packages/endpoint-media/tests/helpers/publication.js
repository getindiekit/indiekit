import {JekyllPreset} from '../../../preset-jekyll/index.js';
import {GithubStore} from '../../../store-github/index.js';

export const publication = {
  config: new JekyllPreset().config,
  me: 'https://website.example',
  media: {
    insertOne: () => {}
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
