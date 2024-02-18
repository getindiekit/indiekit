import makeDebug from "debug";

const debug = makeDebug("indiekit:endpoint-media:media-content");

export const mediaContent = {
  /**
   * Upload file to content store
   * @param {object} publication - Publication configuration
   * @param {object} mediaData - Media data
   * @param {object} file - File to upload
   * @returns {Promise<object>} Data to use in response
   */
  async upload(publication, mediaData, file) {
    debug(`upload %O`, { mediaData });

    const { store, storeMessageTemplate } = publication;
    const { path, properties } = mediaData;
    const metaData = {
      action: "upload",
      result: "uploaded",
      fileType: "file",
      postType: properties["media-type"],
    };
    const message = storeMessageTemplate(metaData);

    await store.createFile(path, file.data, { message });

    return {
      location: properties.url,
      status: 201,
      json: {
        success: "create",
        success_description: `Media uploaded to ${properties.url}`,
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
    debug(`delete %O`, { mediaData });

    const { store, storeMessageTemplate } = publication;
    const { path, properties } = mediaData;
    const metaData = {
      action: "delete",
      result: "deleted",
      fileType: "file",
      postType: properties["media-type"],
    };
    const message = storeMessageTemplate(metaData);

    await store.deleteFile(path, { message });

    return {
      status: 200,
      json: {
        success: "delete",
        success_description: `File deleted from ${properties.url}`,
      },
    };
  },
};
