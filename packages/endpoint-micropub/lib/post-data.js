import { isDeepStrictEqual } from "node:util";

import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl, getDate } from "@indiekit/util";
import makeDebug from "debug";

import { getSyndicateToProperty, normaliseProperties } from "./jf2.js";
import { getPostType } from "./post-type-discovery.js";
import * as updateMf2 from "./update.js";
import { getPostTemplateProperties, renderPath } from "./utils.js";

const debug = makeDebug("indiekit:endpoint-micropub:post-data");

export const postData = {
  /**
   * Create post data
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {object} properties - JF2 properties
   * @param {boolean} [isDraftMode] - Draft mode
   * @returns {Promise<object>} Post data
   */
  async create(application, publication, properties, isDraftMode = false) {
    debug(`Create %O`, { isDraftMode, properties });

    const { timeZone } = application;
    const { me, postTypes, syndicationTargets } = publication;

    // Add syndication targets
    const syndicateTo = getSyndicateToProperty(properties, syndicationTargets);
    if (syndicateTo) {
      properties["mp-syndicate-to"] = syndicateTo;
    }

    // Normalise properties
    properties = normaliseProperties(publication, properties, timeZone);

    // Post type
    const type = getPostType(postTypes, properties);
    properties["post-type"] = type;

    // Get post type configuration
    const typeConfig = postTypes[type];
    if (!typeConfig || !typeConfig.post?.path) {
      throw IndiekitError.notImplemented(type);
    }

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      application,
      publication,
    );
    const url = await renderPath(
      typeConfig.post.url || typeConfig.post.path,
      properties,
      application,
      publication,
    );
    properties.url = getCanonicalUrl(url, me);

    // Post status
    // Draft mode: Only create post with a `draft` post-status
    properties["post-status"] = isDraftMode
      ? "draft"
      : properties["post-status"] || "published";

    const data = { path, properties };

    // Add data to posts collection (or replace existing if present)
    const postsCollection = application?.collections?.get("posts");
    if (postsCollection) {
      const query = { "properties.url": properties.url };
      await postsCollection.replaceOne(query, data, { upsert: true });
    }

    return data;
  },

  /**
   * Read post data
   * @param {object} application - Application configuration
   * @param {string} url - URL of existing post
   * @returns {Promise<object>} Post data
   */
  async read(application, url) {
    debug(`Read ${url}`);

    const query = { "properties.url": url };
    const postsCollection = application?.collections?.get("posts");

    const data = await postsCollection.findOne(query);
    if (!data) {
      throw IndiekitError.notFound(url);
    }

    return data;
  },

  /**
   * Update post data
   *
   * Add, delete or replace properties and/or replace property values
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @param {object} operation - Requested operation(s)
   * @returns {Promise<object>} Post data
   */
  async update(application, publication, url, operation) {
    debug(`Update ${url} %O`, { operation });

    const { timeZone } = application;
    const { me, postTypes } = publication;
    const postsCollection = application?.collections?.get("posts");

    // Read properties
    let { path: _originalPath, properties } = await postData.read(
      application,
      url,
    );

    // Save incoming properties for later comparison
    let oldProperties = structuredClone(properties);

    // Add properties
    if (operation.add) {
      properties = updateMf2.addProperties(properties, operation.add);
    }

    // Replace property entries
    if (operation.replace) {
      properties = await updateMf2.replaceEntries(
        properties,
        operation.replace,
      );
    }

    // Remove properties and/or property entries
    if (operation.delete) {
      properties = Array.isArray(operation.delete)
        ? updateMf2.deleteProperties(properties, operation.delete)
        : updateMf2.deleteEntries(properties, operation.delete);
    }

    // Normalise properties
    properties = normaliseProperties(publication, properties, timeZone);
    oldProperties = normaliseProperties(publication, oldProperties, timeZone);

    // Post type
    const type = getPostType(postTypes, properties);
    const typeConfig = postTypes[type];
    properties["post-type"] = type;

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      application,
      publication,
    );
    const updatedUrl = await renderPath(
      typeConfig.post.url,
      properties,
      application,
      publication,
    );
    properties.url = getCanonicalUrl(updatedUrl, me);

    // Return if no changes to template properties detected
    const newProperties = getPostTemplateProperties(properties);
    oldProperties = getPostTemplateProperties(oldProperties);
    if (isDeepStrictEqual(newProperties, oldProperties)) {
      return;
    }

    // Add updated date
    properties.updated = getDate(timeZone);

    // Update data in posts collection
    const data = { _originalPath, path, properties };
    const query = { "properties.url": url };
    await postsCollection.replaceOne(query, data);

    return data;
  },

  /**
   * Delete post data
   *
   * Delete (most) properties, keeping a record of deleted for later retrieval
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @returns {Promise<object>} Post data
   */
  async delete(application, publication, url) {
    debug(`Delete ${url}`);

    const { timeZone } = application;
    const { postTypes } = publication;
    const postsCollection = application?.collections?.get("posts");

    // Read properties
    const { properties } = await postData.read(application, url);

    // Make a copy of existing properties
    const _deletedProperties = structuredClone(properties);

    // Delete all properties, except those required for path creation
    for (const key in _deletedProperties) {
      if (!["post-type", "published", "slug", "type", "url"].includes(key)) {
        delete properties[key];
      }
    }

    // Add deleted date
    properties.deleted = getDate(timeZone);

    // Post type
    const type = properties["post-type"];
    const typeConfig = postTypes[type];

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      application,
      publication,
    );

    // Update data in posts collection
    const data = { path, properties, _deletedProperties };
    const query = { "properties.url": url };
    await postsCollection.replaceOne(query, data);

    return data;
  },

  /**
   * Undelete post data
   *
   * Restore previously deleted properties
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @param {boolean} [isDraftMode] - Draft mode
   * @returns {Promise<object>} Post data
   */
  async undelete(application, publication, url, isDraftMode) {
    debug(`Undelete ${url} %O`, { isDraftMode });

    const { postTypes } = publication;
    const postsCollection = application?.collections?.get("posts");

    // Read deleted properties
    const { _deletedProperties } = await postData.read(application, url);

    // Restore previously deleted properties
    const properties = _deletedProperties;

    // Post type
    const type = properties["post-type"];
    const typeConfig = postTypes[type];

    // Post paths
    const path = await renderPath(
      typeConfig.post.path,
      properties,
      application,
      publication,
    );

    // Post status
    // Draft mode: Only restore post with a `draft` post-status
    properties["post-status"] = isDraftMode
      ? "draft"
      : properties["post-status"] || "published";

    // Update data in posts collection
    const data = { path, properties };
    const query = { "properties.url": url };
    await postsCollection.replaceOne(query, data);

    return data;
  },
};
