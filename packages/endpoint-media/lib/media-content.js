import makeDebug from "debug";

const debug = makeDebug("indiekit:endpoint-media:media-content");

export const mediaContent = {
  /**
   * Upload file to content store
   * @param {IndiekitPublication} publication - Publication configuration
   * @param {Jf2MediaData} mediaData - Media data
   * @param {{data: Uint8Array}} file - File to upload
   * @returns {Promise<MicropubActionResponse>} Data to use in response
   */
  async upload(publication, mediaData, file) {
    debug(`Upload %O`, { mediaData });

    const { mediaStore, storeMessageTemplate } = publication;
    const { path, properties } = mediaData;
    const metadata = {
      action: "upload",
      result: "uploaded",
      fileType: "file",
      postType: properties["media-type"],
    };
    const message = storeMessageTemplate(metadata);

    await mediaStore.createFile(path, file.data, { message });

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
   * @param {IndiekitPublication} publication - Publication configuration
   * @param {Jf2MediaData} mediaData - Post data
   * @returns {Promise<MicropubActionResponse>} Response data
   */
  async delete(publication, mediaData) {
    debug(`Delete %O`, { mediaData });

    const { mediaStore, storeMessageTemplate } = publication;
    const { path, properties } = mediaData;
    const metadata = {
      action: "delete",
      result: "deleted",
      fileType: "file",
      postType: properties["media-type"],
    };
    const message = storeMessageTemplate(metadata);

    await mediaStore.deleteFile(path, { message });

    return {
      status: 200,
      json: {
        success: "delete",
        success_description: `File deleted from ${properties.url}`,
      },
    };
  },
};
