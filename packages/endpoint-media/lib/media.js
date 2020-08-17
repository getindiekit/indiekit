import {supplant} from './utils.js';

export const media = {
  /**
   * Upload file
   *
   * @param {object} publication Publication configuration
   * @param {object} mediaData Media data
   * @param {object} file File to upload
   * @returns {object} Data to use in response
   */
  upload: async (publication, mediaData, file) => {
    const {media, store} = publication;
    const message = supplant(store.messageFormat, {
      action: 'upload',
      fileType: 'media',
      postType: mediaData.properties['post-type']
    });
    const uploaded = await store.createFile(mediaData.path, file.buffer, message);

    if (uploaded) {
      mediaData.date = new Date();
      mediaData.lastAction = 'upload';
      await media.insertOne(mediaData);
      return {
        location: mediaData.properties.url,
        status: 201,
        json: {
          success: 'create',
          success_description: `Media uploaded to ${mediaData.properties.url}`
        }
      };
    }
  }
};
