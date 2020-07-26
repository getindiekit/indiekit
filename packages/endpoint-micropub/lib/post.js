import {mf2tojf2} from '@paulrobertlloyd/mf2tojf2';
import {supplant} from './utils.js';

export const post = {
  /**
   * Create post
   *
   * @param {object} publication Publication configuration
   * @param {object} postData Post data
   * @returns {object} Response data
   */
  create: async (publication, postData) => {
    const {posts, store} = publication;
    const jf2 = mf2tojf2({items: [postData.mf2]});
    const content = publication.postTemplate(jf2);
    const message = supplant(store.messageFormat, {
      action: 'create',
      fileType: 'post',
      postType: postData.type
    });
    const published = await store.createFile(postData.path, content, message);

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
    const {posts, store} = publication;
    const content = publication.postTemplate(postData.mf2.properties);
    const message = supplant(store.messageFormat, {
      action: 'update',
      fileType: 'post',
      postType: postData.type
    });
    const published = await store.updateFile(postData.path, content, message);

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
    const message = supplant(store.messageFormat, {
      action: 'delete',
      fileType: 'post',
      postType: postData.type
    });
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
    const {posts, store} = publication;

    if (postData.lastAction !== 'delete') {
      throw new Error('Post was not previously deleted');
    }

    const content = publication.postTemplate(postData.mf2.properties);
    const message = supplant(store.messageFormat, {
      action: 'undelete',
      fileType: 'post',
      postType: postData.type
    });
    const published = await store.createFile(postData.path, content, message);

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
