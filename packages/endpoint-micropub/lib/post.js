import {getPostTypeConfig} from './utils.js';
import {createPostContent} from './post/content.js';

export const Post = class {
  constructor(publication) {
    this.publication = publication;
  }

  async create(postData) {
    const {config, posts, store} = this.publication;

    try {
      const postTypeConfig = getPostTypeConfig(config, postData.type);
      const postContent = createPostContent(postData, postTypeConfig.template);
      const message = `${postData.type}: create post`;
      const published = await store.createFile(postData.path, postContent, message);

      if (published) {
        await posts.set(postData.url, postData);
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

  async delete({postData}) {
    const {store} = this.publication;

    try {
      const message = `${postData.type}: delete post`;
      const published = await store.deleteFile(postData.path, message);

      if (published) {
        return {
          status: 200,
          success: 'delete',
          description: `Post deleted from ${postData.url}`
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
