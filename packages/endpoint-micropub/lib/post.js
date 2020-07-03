import got from 'got';
import {getPostTypeConfig} from './utils.js';
import {createPostContent} from './post/content.js';

export const post = {
  /**
   * Create post
   *
   * @param {object} publication Publication configuration
   * @param {object} postData Post data
   * @param {object} files Files attached to request
   * @returns {object} Response data
   */
  create: async (publication, postData, files) => {
    const {config, posts, store} = publication;

    try {
      // Upload attached media and add its URL to respective body property
      // BUG: Promise doesn’t resolve due to upstream issue with media endpoint
      if (files && files.length > 0) {
        const mediaEndpoint = config['media-endpoint'];
        const uploads = [];

        for (const file of files) {
          const mediaPost = got.post(mediaEndpoint, {
            form: {file}
          }).json();

          uploads.push(mediaPost);
        }

        const uploaded = Promise.all(uploads);
        for (const upload of uploaded) {
          console.log('upload', upload.type, upload.url);
          const property = upload.type;
          postData.mf2.properties[property].push(upload.url);
        }
      }

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
