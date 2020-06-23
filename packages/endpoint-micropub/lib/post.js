import {getPostTypeConfig} from './utils.js';
import {createPostContent} from './post/content.js';
import {createPostData} from './post/data.js';

export const Post = class {
  constructor(publication) {
    this.publication = publication;
  }

  async create(mf2) {
    const {config, store} = this.publication;

    try {
      const postData = await createPostData(mf2, this.publication);
      const postTypeConfig = getPostTypeConfig(config, postData.type);
      const postContent = createPostContent(postData, postTypeConfig.template);
      const message = `${postData.type}: create post`;
      const published = await store.createFile(postData.path, postContent, message);

      if (published) {
        return {
          location: postData.url,
          status: 202,
          success: 'create_pending',
          description: `Post will be created at ${postData.url}`
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
