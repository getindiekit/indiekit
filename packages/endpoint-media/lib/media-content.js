export const mediaContent = {
  /**
   * Upload file to content store
   * @param {object} publication - Publication configuration
   * @param {object} mediaData - Media data
   * @param {object} file - File to upload
   * @returns {Promise<object>} Data to use in response
   */
  async upload(publication, mediaData, file) {
    const { store, storeMessageTemplate } = publication;
    const metaData = {
      action: "upload",
      result: "uploaded",
      fileType: "file",
      postType: mediaData.properties["media-type"],
    };
    const message = storeMessageTemplate(metaData);

    await store.createFile(mediaData.path, file.data, message);

    return {
      location: mediaData.properties.url,
      status: 201,
      json: {
        success: "create",
        success_description: `Media uploaded to ${mediaData.properties.url}`,
      },
    };
  },

  /**
   * Delete file from content store
   * @param {object} publication - Publication configuration
   * @param {object} mediaData - Post data
   * @returns {Promise<object>} Response data
   */
  async delete(publication, mediaData) {
    const { store, storeMessageTemplate } = publication;
    const metaData = {
      action: "delete",
      result: "deleted",
      fileType: "file",
      postType: mediaData.properties["media-type"],
    };
    const message = storeMessageTemplate(metaData);

    await store.deleteFile(mediaData.path, message);

    return {
      status: 200,
      json: {
        success: "delete",
        success_description: `File deleted from ${mediaData.properties.url}`,
      },
    };
  },
};
