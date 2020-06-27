import {getPostTypeConfig} from './utils.js';
import {createPostContent} from './post/content.js';

export const Post = class {
  constructor(publication) {
    this.publication = publication;
  }

  async create(postData) {
    const {config, posts, store} = this.publication;

    try {
      const postTypeConfig = getPostTypeConfig(postData.type, config);
      const postContent = createPostContent(postData, postTypeConfig.template);
      const message = `${postData.type}: create post`;
      const published = await store.createFile(postData.path, postContent, message);

      if (published) {
        postData.lastAction = 'create';
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

  async update(postData, url) {
    const {config, posts, store} = this.publication;

    try {
      const postTypeConfig = getPostTypeConfig(postData.type, config);
      const postContent = await createPostContent(postData, postTypeConfig.template);
      const message = `${postData.type}: update post`;
      const published = await store.updateFile(postData.path, postContent, message);

      if (published) {
        postData.lastAction = 'update';
        await posts.set(postData.url, postData);
        const hasUpdatedUrl = (url !== postData.url);
        return {
          location: postData.url,
          status: hasUpdatedUrl ? 201 : 200,
          success: 'update',
          description: hasUpdatedUrl ?
            `Post updated and moved to ${postData.url}` :
            `Post updated at ${url}`
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(postData) {
    const {posts, store} = this.publication;

    try {
      const message = `${postData.type}: delete post`;
      const published = await store.deleteFile(postData.path, message);

      if (published) {
        postData.lastAction = 'delete';
        await posts.set(postData.url, postData);

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

  async undelete(postData) {
    const {config, posts, store} = this.publication;

    if (postData.lastAction !== 'delete') {
      throw new Error('Post was not previously deleted');
    }

    try {
      const postTypeConfig = getPostTypeConfig(postData.type, config);
      const postContent = createPostContent(postData, postTypeConfig.template);
      const message = `${postData.type}: undelete post`;
      const published = await store.createFile(postData.path, postContent, message);

      if (published) {
        postData.lastAction = 'undelete';
        await posts.set(postData.url, postData);

        return {
          location: postData.url,
          status: 200,
          success: 'delete_undelete',
          description: `Post undeleted from ${postData.url}`
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
