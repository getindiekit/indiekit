export const media = {
  /**
   * Upload file
   *
   * @param {object} publication Publication configuration
   * @param {object} mediaData Media data
   * @param {object} file File to upload
   * @returns {object} Data to use in response
   */
  async upload(publication, mediaData, file) {
    const { media, store, storeMessageTemplate } = publication;
    const metaData = {
      action: "upload",
      result: "uploaded",
      fileType: "file",
      postType: mediaData.properties["post-type"],
    };
    const message = storeMessageTemplate(metaData);
    const uploaded = await store.createFile(
      mediaData.path,
      file.buffer,
      message
    );

    if (uploaded) {
      mediaData.date = new Date();
      mediaData.lastAction = metaData.action;

      if (media) {
        await media.insertOne(mediaData);
      }

      return {
        location: mediaData.properties.url,
        status: 201,
        json: {
          success: "create",
          success_description: `Media uploaded to ${mediaData.properties.url}`,
        },
      };
    }
  },
};
