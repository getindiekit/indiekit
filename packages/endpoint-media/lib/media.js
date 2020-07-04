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

    try {
      const message = `${mediaData.type}: upload media`;
      const uploaded = await store.createFile(mediaData.path, file.buffer, message);

      if (uploaded) {
        mediaData.lastAction = 'upload';
        await media.set(mediaData.url, mediaData);
        return {
          location: mediaData.url,
          status: 201,
          success: 'create',
          description: `Media uploaded to ${mediaData.url}`,
          type: mediaData.type
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
