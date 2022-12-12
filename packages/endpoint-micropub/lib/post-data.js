import { IndiekitError } from "@indiekit/error";
import { getPostType } from "./post-type-discovery.js";
import { getDate } from "./date.js";
import { getSyndicateToProperty, normaliseProperties } from "./jf2.js";
import * as update from "./update.js";
import { getPermalink, getPostTypeConfig, renderPath } from "./utils.js";

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
    const { me, postTypes, syndicationTargets } = publication;

    // Add syndication targets
    const syndicateTo = getSyndicateToProperty(properties, syndicationTargets);
    if (syndicateTo) {
      properties["mp-syndicate-to"] = syndicateTo;
    }

    // Normalise properties
    properties = normaliseProperties(publication, properties);

    // Add published date (or use that provided by client)
    properties.published = getDate(publication.timeZone, properties.published);

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

    // Post status
    // Draft mode: Only create post with a `draft` post-status
    properties["post-status"] = draftMode
      ? "draft"
      : properties["post-status"] || "published";

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
    const { posts } = publication;
    const post = await posts.findOne({
      "properties.url": url,
    });

    if (!post) {
      throw IndiekitError.notFound(url);
    }

    return post;
  },

  /**
   * Update post data
   * Add, delete or replace properties and/or replace property values
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

    // Add updated date
    properties.updated = getDate(publication.timeZone);

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

    // Return updated post data
    const postData = { path, properties };
    return postData;
  },

  /**
   * Delete post data
   * Delete (most) properties, keeping a record of deleted for later retrieval
   *
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @returns {object} Post data
   */
  async delete(publication, url) {
    const { postTypes } = publication;

    // Read properties
    const { properties } = await this.read(publication, url);

    // Make a copy of existing properties
    const _deletedProperties = structuredClone(properties);

    // Delete all properties, except those required for path creation
    for (const key in _deletedProperties) {
      if (!["mp-slug", "post-type", "published", "type", "url"].includes(key)) {
        delete properties[key];
      }
    }

    // Add deleted date
    properties.deleted = getDate(publication.timeZone);

    // Post type
    const typeConfig = getPostTypeConfig(properties["post-type"], postTypes);

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      publication
    );

    // Return post data
    const postData = { path, properties, _deletedProperties };
    return postData;
  },

  /**
   * Undelete post data
   * Restore previously deleted properties
   *
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @param {boolean} [draftMode=false] - Draft mode
   * @returns {object} Post data
   */
  async undelete(publication, url, draftMode) {
    const { postTypes } = publication;

    // Read deleted properties
    const { _deletedProperties } = await this.read(publication, url);

    // Restore previously deleted properties
    const properties = _deletedProperties;

    // Post type
    const typeConfig = getPostTypeConfig(properties["post-type"], postTypes);

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      publication
    );

    // Post status
    // Draft mode: Only restore post with a `draft` post-status
    properties["post-status"] = draftMode
      ? "draft"
      : properties["post-status"] || "published";

    // Return post data
    const postData = { path, properties, _deletedProperties };
    return postData;
  },
};
