import {getPostTypeConfig} from './utils.js';
import {createPostContent} from './post/content.js';

export const post = {
  /**
   * Create post
   *
   * @param {object} publication Publication configuration
   * @param {object} postData Post data
   * @returns {object} Response data
   */
  create: async (publication, postData) => {
    const {config, posts, store} = publication;
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
        json: {
          success: 'create_pending',
          success_description: `Post will be created at ${postData.url}`
        }
      };
    }
  },

  /**
   * Update post
   *
   * @param {object} publication Publication configuration
   * @param {object} postData Post data
   * @param {string} url Files attached to request
   * @returns {object} Response data
   */
  update: async (publication, postData, url) => {
    const {config, posts, store} = publication;
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
        json: {
          success: 'update',
          success_description: hasUpdatedUrl ?
            `Post updated and moved to ${postData.url}` :
            `Post updated at ${url}`
        }
      };
    }
  },

  /**
   * Delete post
   *
   * @param {object} publication Publication configuration
   * @param {object} postData Post data
   * @returns {object} Response data
   */
  delete: async (publication, postData) => {
    const {posts, store} = publication;
    const message = `${postData.type}: delete post`;
    const published = await store.deleteFile(postData.path, message);

    if (published) {
      postData.lastAction = 'delete';
      await posts.set(postData.url, postData);

      return {
        status: 200,
        json: {
          success: 'delete',
          success_description: `Post deleted from ${postData.url}`
        }
      };
    }
  },

  /**
   * Undelete post
   *
   * @param {object} publication Publication configuration
   * @param {object} postData Post data
   * @returns {object} Response data
   */
  undelete: async (publication, postData) => {
    const {config, posts, store} = publication;

    if (postData.lastAction !== 'delete') {
      throw new Error('Post was not previously deleted');
    }

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
        json: {
          success: 'delete_undelete',
          success_description: `Post undeleted from ${postData.url}`
        }
      };
    }
  }
};
