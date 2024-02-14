import makeDebug from "debug";
import { getPostTemplateProperties } from "./utils.js";

const debug = makeDebug("indiekit:endpoint-micropub:post-content");

export const postContent = {
  /**
   * Create post
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {Promise<object>} Response data
   */
  async create(publication, postData) {
    debug(`create %O`, { postData });

    const { postTemplate, store, storeMessageTemplate } = publication;
    const { path, properties } = postData;
    const metaData = {
      action: "create",
      result: "created",
      fileType: "post",
      postType: properties["post-type"],
    };
    const templateProperties = getPostTemplateProperties(properties);
    const content = await postTemplate(templateProperties);
    const message = storeMessageTemplate(metaData);

    await store.createFile(path, content, { message });

    return {
      location: properties.url,
      status: 202,
      json: {
        success: "create_pending",
        success_description: `Post will be created at ${properties.url}`,
      },
    };
  },

  /**
   * Update post
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @param {string} url - Files attached to request
   * @returns {Promise<object>} Response data
   */
  async update(publication, postData, url) {
    debug(`update ${url} %O`, { postData });

    const { postTemplate, store, storeMessageTemplate } = publication;
    const { _originalPath, path, properties } = postData;
    const metaData = {
      action: "update",
      result: "updated",
      fileType: "post",
      postType: properties["post-type"],
    };
    const templateProperties = getPostTemplateProperties(properties);
    const content = await postTemplate(templateProperties);
    const message = storeMessageTemplate(metaData);
    const hasUpdatedUrl = url !== properties.url;

    _originalPath === path
      ? await store.updateFile(path, content, { message })
      : await store.updateFile(_originalPath, content, {
          message,
          newPath: path,
        });

    delete postData._originalPath;

    return {
      location: properties.url,
      status: hasUpdatedUrl ? 201 : 200,
      json: {
        success: "update",
        success_description: hasUpdatedUrl
          ? `Post updated and moved to ${properties.url}`
          : `Post updated at ${url}`,
      },
    };
  },

  /**
   * Delete post
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {Promise<object>} Response data
   */
  async delete(publication, postData) {
    debug(`delete %O`, { postData });

    const { store, storeMessageTemplate } = publication;
    const { path, properties } = postData;
    const metaData = {
      action: "delete",
      result: "deleted",
      fileType: "post",
      postType: properties["post-type"],
    };
    const message = storeMessageTemplate(metaData);

    await store.deleteFile(path, { message });

    return {
      status: 200,
      json: {
        success: "delete",
        success_description: `Post deleted from ${properties.url}`,
      },
    };
  },

  /**
   * Undelete post
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {Promise<object>} Response data
   */
  async undelete(publication, postData) {
    debug(`undelete %O`, { postData });

    const { postTemplate, store, storeMessageTemplate } = publication;
    const { path, properties } = postData;
    const metaData = {
      action: "undelete",
      result: "undeleted",
      fileType: "post",
      postType: properties["post-type"],
    };
    const templateProperties = getPostTemplateProperties(properties);
    const content = await postTemplate(templateProperties);
    const message = storeMessageTemplate(metaData);

    await store.createFile(path, content, { message });

    return {
      location: properties.url,
      status: 200,
      json: {
        success: "delete_undelete",
        success_description: `Post restored to ${properties.url}`,
      },
    };
  },
};
