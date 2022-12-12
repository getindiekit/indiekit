export const post = {
  /**
   * Create post
   *
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @param {boolean} [draftMode=false] - Draft mode
   * @returns {object} Response data
   */
  async create(publication, postData, draftMode = false) {
    const { posts, postTemplate, store, storeMessageTemplate } = publication;
    const metaData = {
      action: "create",
      result: "created",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const content = postTemplate(postData.properties);
    const message = storeMessageTemplate(metaData);
    const published = await store.createFile(postData.path, content, message);

    if (published) {
      postData.properties["post-status"] = draftMode
        ? "draft"
        : postData.properties["post-status"] || "published";

      if (posts) {
        await posts.insertOne(postData, {
          checkKeys: false,
        });
      }

      return {
        location: postData.properties.url,
        status: 202,
        json: {
          success: "create_pending",
          success_description: `Post will be created at ${postData.properties.url}`,
        },
      };
    }
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
    const { posts, postTemplate, store, storeMessageTemplate } = publication;
    const metaData = {
      action: "update",
      result: "updated",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const content = postTemplate(postData.properties);
    const message = storeMessageTemplate(metaData);
    const updated = await store.updateFile(postData.path, content, message);

    if (updated) {
      postData.properties.updated = new Date();

      if (posts) {
        await posts.replaceOne(
          {
            "properties.url": postData.properties.url,
          },
          postData,
          {
            checkKeys: false,
          }
        );
      }

      const hasUpdatedUrl = url !== postData.properties.url;
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
    }
  },

  /**
   * Delete post
   *
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {object} Response data
   */
  async delete(publication, postData) {
    const { posts, store, storeMessageTemplate } = publication;
    const metaData = {
      action: "delete",
      result: "deleted",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const message = storeMessageTemplate(metaData);
    const deleted = await store.deleteFile(postData.path, message);

    if (deleted) {
      postData.properties["post-status"] = "deleted";
      postData.properties.updated = new Date();

      if (posts) {
        await posts.replaceOne(
          {
            "properties.url": postData.properties.url,
          },
          postData,
          {
            checkKeys: false,
          }
        );
      }

      return {
        status: 200,
        json: {
          success: "delete",
          success_description: `Post deleted from ${postData.properties.url}`,
        },
      };
    }
  },

  /**
   * Undelete post
   *
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @param {boolean} [draftMode=false] - Draft mode
   * @returns {object} Response data
   */
  async undelete(publication, postData, draftMode = false) {
    const { posts, postTemplate, store, storeMessageTemplate } = publication;

    if (postData.properties?.["post-status"] !== "deleted") {
      throw new Error("Post was not previously deleted");
    }

    const metaData = {
      action: "undelete",
      result: "undeleted",
      fileType: "post",
      postType: postData.properties["post-type"],
    };
    const content = postTemplate(postData.properties);
    const message = storeMessageTemplate(metaData);
    const undeleted = await store.createFile(postData.path, content, message);

    if (undeleted) {
      postData.properties["post-status"] = draftMode
        ? "draft"
        : postData.properties["post-status"] || "published";
      postData.properties.updated = new Date();

      if (posts) {
        await posts.replaceOne(
          {
            "properties.url": postData.properties.url,
          },
          postData,
          {
            checkKeys: false,
          }
        );
      }

      return {
        location: postData.properties.url,
        status: 200,
        json: {
          success: "delete_undelete",
          success_description: `Post restored to ${postData.properties.url}`,
        },
      };
    }
  },
};
