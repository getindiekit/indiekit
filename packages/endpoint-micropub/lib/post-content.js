export const postContent = {
  /**
   * Create post
   *
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {object} Response data
   */
  async create(publication, postData) {
    const { postTemplate, store, storeMessageTemplate } = publication;
    const metaData = {
      action: "create",
      result: "created",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const content = await postTemplate(postData.properties);
    const message = storeMessageTemplate(metaData);

    await store.createFile(postData.path, content, message);

    return {
      location: postData.properties.url,
      status: 202,
      json: {
        success: "create_pending",
        success_description: `Post will be created at ${postData.properties.url}`,
      },
    };
  },

  /**
   * Update post
   *
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @param {string} url - Files attached to request
   * @returns {object} Response data
   */
  async update(publication, postData, url) {
    const { postTemplate, store, storeMessageTemplate } = publication;
    const metaData = {
      action: "update",
      result: "updated",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const content = await postTemplate(postData.properties);
    const message = storeMessageTemplate(metaData);
    const hasUpdatedUrl = url !== postData.properties.url;

    await store.updateFile(postData.path, content, message);

    return {
      location: postData.properties.url,
      status: hasUpdatedUrl ? 201 : 200,
      json: {
        success: "update",
        success_description: hasUpdatedUrl
          ? `Post updated and moved to ${postData.properties.url}`
          : `Post updated at ${url}`,
      },
    };
  },

  /**
   * Delete post
   *
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {object} Response data
   */
  async delete(publication, postData) {
    const { postTemplate, store, storeMessageTemplate } = publication;
    const metaData = {
      action: "delete",
      result: "deleted",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const content = await postTemplate(postData.properties);
    const message = storeMessageTemplate(metaData);

    await store.updateFile(postData.path, content, message);

    return {
      status: 200,
      json: {
        success: "delete",
        success_description: `Post deleted from ${postData.properties.url}`,
      },
    };
  },

  /**
   * Undelete post
   *
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {object} Response data
   */
  async undelete(publication, postData) {
    const { postTemplate, store, storeMessageTemplate } = publication;

    const metaData = {
      action: "undelete",
      result: "undeleted",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const content = await postTemplate(postData.properties);
    const message = storeMessageTemplate(metaData);

    await store.updateFile(postData.path, content, message);

    return {
      location: postData.properties.url,
      status: 200,
      json: {
        success: "delete_undelete",
        success_description: `Post restored to ${postData.properties.url}`,
      },
    };
  },
};
