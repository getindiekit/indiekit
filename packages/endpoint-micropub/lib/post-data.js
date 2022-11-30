import { IndiekitError } from "@indiekit/error";
import { getPostType } from "./post-type-discovery.js";
import { normaliseProperties } from "./jf2.js";
import * as update from "./update.js";
import { renderPath, getPermalink, getPostTypeConfig } from "./utils.js";

export const postData = {
  /**
   * Create post data
   *
   * @param {object} publication - Publication configuration
   * @param {object} properties - JF2 properties
   * @param {boolean} [draftMode=false] - Draft mode
   * @returns {object} Post data
   */
  async create(publication, properties, draftMode = false) {
    const { me, postTypes } = publication;

    // Normalise properties
    properties = normaliseProperties(publication, properties);

    // Post type
    const type = getPostType(properties);
    properties["post-type"] = type;

    // Get post type configuration
    const typeConfig = getPostTypeConfig(type, postTypes);
    if (!typeConfig) {
      throw IndiekitError.notImplemented(type);
    }

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      publication
    );
    const url = await renderPath(typeConfig.post.url, properties, publication);
    properties.url = getPermalink(me, url);

    // Add post status if creating in draft mode
    if (draftMode) {
      properties["post-status"] = "draft";
    }

    // Post data
    const postData = { path, properties };
    return postData;
  },

  /**
   * Read post data
   *
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @param {boolean} [draftMode=false] - Draft mode
   * @returns {object} Post data
   */
  async read(publication, url, draftMode = false) {
    const { posts } = publication;
    const post = await posts.findOne({
      "properties.url": url,
    });

    if (!post) {
      throw IndiekitError.notFound(url);
    }

    // Add post status if reading in draft mode
    if (draftMode) {
      post.properties["post-status"] = "draft";
    }

    return post;
  },

  /**
   * Update post data
   *
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @param {object} operation - Requested operation(s)
   * @returns {object} Post data
   */
  async update(publication, url, operation) {
    const { me, postTypes } = publication;

    // Read properties
    let { properties } = await this.read(publication, url);

    // Add properties
    if (operation.add) {
      properties = update.addProperties(properties, operation.add);
    }

    // Replace property entries
    if (operation.replace) {
      properties = update.replaceEntries(properties, operation.replace);
    }

    // Remove properties and/or property entries
    if (operation.delete) {
      properties = Array.isArray(operation.delete)
        ? update.deleteProperties(properties, operation.delete)
        : update.deleteEntries(properties, operation.delete);
    }

    // Normalise properties
    properties = normaliseProperties(publication, properties);

    // Post type
    const type = getPostType(properties);
    const typeConfig = getPostTypeConfig(type, postTypes);
    properties["post-type"] = type;

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      publication
    );
    const updatedUrl = await renderPath(
      typeConfig.post.url,
      properties,
      publication
    );
    properties.url = getPermalink(me, updatedUrl);

    // Return post data
    const updatedPostData = { path, properties };
    return updatedPostData;
  },
};
