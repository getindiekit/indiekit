import HttpError from "http-errors";
import { getPostType } from "./post-type-discovery.js";
import { normaliseProperties } from "./jf2.js";
import * as update from "./update.js";
import { renderPath, getPermalink, getPostTypeConfig } from "./utils.js";

export const postData = {
  /**
   * Create post data
   *
   * @param {object} publication Publication configuration
   * @param {object} properties JF2 properties
   * @returns {object} Post data
   */
  async create(publication, properties) {
    try {
      if (!publication) {
        throw new Error("No publication configuration provided");
      }

      if (!properties) {
        throw new Error("No properties included in request");
      }

      const { me, postTypes, timeZone } = publication;

      // Normalise properties
      properties = normaliseProperties(publication, properties);

      // Post type
      const type = getPostType(properties);
      const typeConfig = getPostTypeConfig(type, postTypes);
      properties["post-type"] = type;

      // Post paths
      const path = renderPath(typeConfig.post.path, properties, timeZone);
      const url = renderPath(typeConfig.post.url, properties, timeZone);
      properties.url = getPermalink(me, url);

      // Post data
      const postData = { path, properties };
      return postData;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },

  /**
   * Read post data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of existing post
   * @returns {object} Post data
   */
  async read(publication, url) {
    try {
      if (!publication) {
        throw new Error("No publication configuration provided");
      }

      if (!url) {
        throw new Error("No URL provided");
      }

      const { posts } = publication;
      const post = await posts.findOne({
        "properties.url": url,
      });
      return post;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },

  /**
   * Update post data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of existing post
   * @param {object} operation Requested operation(s)
   * @returns {object} Post data
   */
  async update(publication, url, operation) {
    try {
      if (!publication) {
        throw new Error("No publication configuration provided");
      }

      if (!url) {
        throw new Error("No URL provided");
      }

      if (!operation) {
        throw new Error("No update operation provided");
      }

      const { me, posts, postTypes, timeZone } = publication;

      const postData = await posts.findOne({
        "properties.url": url,
      });

      if (!postData) {
        throw new Error(`No post record available for ${url}`);
      }

      let { properties } = postData;

      // Normalise properties
      properties = normaliseProperties(publication, properties);

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

      // Post type
      const type = getPostType(properties);
      const typeConfig = getPostTypeConfig(type, postTypes);
      properties["post-type"] = type;

      // Post paths
      const path = renderPath(typeConfig.post.path, properties, timeZone);
      const updatedUrl = renderPath(typeConfig.post.url, properties, timeZone);
      properties.url = getPermalink(me, updatedUrl);

      // Return post data
      const updatedPostData = { path, properties };
      return updatedPostData;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },
};
