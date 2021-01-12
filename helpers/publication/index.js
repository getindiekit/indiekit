import {GithubStore} from '../../packages/store-github/index.js';

export const publication = {
  me: process.env.TEST_PUBLICATION_URL,
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
