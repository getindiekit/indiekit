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
   * @returns {object} Post data
   */
  async create(publication, properties) {
    if (!publication) {
      throw new IndiekitError("No publication configuration provided");
    }

    if (!properties) {
      throw IndiekitError.badRequest("No properties included in request");
    }

    const { me, postTypes } = publication;

    // Normalise properties
    properties = normaliseProperties(publication, properties);

    // Post type
    const type = getPostType(properties);
    properties["post-type"] = type;

    // Get post type configuration
    const typeConfig = getPostTypeConfig(type, postTypes);
    if (!typeConfig) {
      throw new IndiekitError(
        `No configuration found for ${type} post type. See https://getindiekit.com/customisation/post-types/`
      );
    }

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      publication
    );
    const url = await renderPath(typeConfig.post.url, properties, publication);
    properties.url = getPermalink(me, url);

    // Post data
    const postData = { path, properties };
    return postData;
  },

  /**
   * Read post data
   *
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @returns {object} Post data
   */
  async read(publication, url) {
    if (!publication) {
      throw new IndiekitError("No publication configuration provided");
    }

    if (!url) {
      throw IndiekitError.badRequest("No URL provided");
    }

    const { posts } = publication;
    const post = await posts.findOne({
      "properties.url": url,
    });
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
    if (!publication) {
      throw new IndiekitError("No publication configuration provided");
    }

    if (!url) {
      throw IndiekitError.badRequest("No URL provided");
    }

    if (!operation) {
      throw IndiekitError.badRequest("No update operation provided");
    }

    const { me, posts, postTypes } = publication;

    const postData = await posts.findOne({
      "properties.url": url,
    });

    if (!postData) {
      throw IndiekitError.notFound(`No post record available for ${url}`);
    }

    let { properties } = postData;

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
