import makeDebug from "debug";
import { storeData } from "./store-data.js";
import { getPostTemplateProperties } from "./utils.js";

const debug = makeDebug("indiekit:endpoint-micropub:post-content");

export const postContent = {
  /**
   * Create post
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {Promise<object>} Response data
   */
  async create(application, publication, postData) {
    debug(`create %O`, { postData });

    const { postTemplate, store, storeMessageTemplate } = publication;
    const { properties, storeProperties } = postData;
    const metaData = {
      action: "create",
      result: "created",
      fileType: "post",
      postType: properties["post-type"],
    };
    const templateProperties = getPostTemplateProperties(properties);
    const content = await postTemplate(templateProperties);
    const message = storeMessageTemplate(metaData);

    const storeUrl = await store.createFile(storeProperties.path, content, {
      message,
    });

    await storeData.create(application, postData, storeUrl);

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
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @param {string} url - Files attached to request
   * @returns {Promise<object>} Response data
   */
  async update(application, publication, postData, url) {
    debug(`update ${url} %O`, { postData });

    const { postTemplate, store, storeMessageTemplate } = publication;
    const { properties, storeProperties } = postData;
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

    const storeUrl =
      storeProperties._originalPath === storeProperties.path
        ? await store.updateFile(storeProperties.path, content, { message })
        : await store.updateFile(storeProperties._originalPath, content, {
            message,
            newPath: storeProperties.path,
          });

    await storeData.update(application, postData, storeUrl);

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
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {Promise<object>} Response data
   */
  async delete(application, publication, postData) {
    debug(`delete %O`, { postData });

    const { store, storeMessageTemplate } = publication;
    const { properties, storeProperties } = postData;
    const metaData = {
      action: "delete",
      result: "deleted",
      fileType: "post",
      postType: properties["post-type"],
    };
    const message = storeMessageTemplate(metaData);

    await store.deleteFile(storeProperties.path, { message });

    await storeData.delete(application, postData);

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
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {object} postData - Post data
   * @returns {Promise<object>} Response data
   */
  async undelete(application, publication, postData) {
    debug(`undelete %O`, { postData });

    const { postTemplate, store, storeMessageTemplate } = publication;
    const { properties, storeProperties } = postData;
    const metaData = {
      action: "undelete",
      result: "undeleted",
      fileType: "post",
      postType: properties["post-type"],
    };
    const templateProperties = getPostTemplateProperties(properties);
    const content = await postTemplate(templateProperties);
    const message = storeMessageTemplate(metaData);

    const storeUrl = await store.createFile(storeProperties.path, content, {
      message,
    });

    await storeData.create(application, postData, storeUrl);

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
