import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl } from "@indiekit/util";
import makeDebug from "debug";

import { getFileProperties, getMediaType } from "./file.js";
import { renderPath } from "./utils.js";

const debug = makeDebug("indiekit:endpoint-media:media-data");

export const mediaData = {
  /**
   * Create media data
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {object} file - File
   * @returns {Promise<object>} Media data
   */
  async create(application, publication, file) {
    debug(`Create %O`, { file });

    const { timeZone } = application;
    const { me, postTypes } = publication;

    // Media properties
    const properties = await getFileProperties(publication, file, timeZone);

    // Get post type configuration
    const type = await getMediaType(file);
    properties["media-type"] = type;

    // Throw error if trying to create unsupported media
    const supportedMediaTypes = ["audio", "photo", "video"];
    if (!supportedMediaTypes.includes(type)) {
      throw IndiekitError.unsupportedMediaType(type);
    }

    // Get post type configuration
    const typeConfig = postTypes[type];
    if (!typeConfig) {
      throw IndiekitError.notImplemented(type);
    }

    // Media paths
    const path = await renderPath(
      typeConfig.media.path,
      properties,
      application,
    );
    const url = await renderPath(
      typeConfig.media.url || typeConfig.media.path,
      properties,
      application,
    );
    properties.url = getCanonicalUrl(url, me);

    // Update media properties based on type configuration
    const urlPathSegment = properties.url.split("/");
    properties.filename = urlPathSegment.at(-1);

    const mediaData = { path, properties };

    // Add data to media collection (or replace existing if present)
    const mediaCollection = application?.collections?.get("media");
    if (mediaCollection) {
      const query = { "properties.url": properties.url };
      await mediaCollection.replaceOne(query, mediaData, { upsert: true });
    }

    return mediaData;
  },

  /**
   * Read media data
   * @param {object} application - Application configuration
   * @param {string} url - URL of existing media
   * @returns {Promise<object>} Media data
   */
  async read(application, url) {
    debug(`Read ${url}`);

    const query = { "properties.url": url };

    const mediaCollection = application?.collections?.get("media");
    const mediaData = await mediaCollection.findOne(query);
    if (!mediaData) {
      throw IndiekitError.notFound(url);
    }

    return mediaData;
  },

  /**
   * Delete media data
   * @param {object} application - Application configuration
   * @param {string} url - URL of existing post
   * @returns {Promise<boolean>} Media data deleted
   */
  async delete(application, url) {
    debug(`Delete ${url}`);

    const query = { "properties.url": url };

    const mediaCollection = application?.collections?.get("media");
    const result = await mediaCollection.deleteOne(query);
    if (result?.deletedCount === 1) {
      return true;
    }

    throw new Error("No media data to delete");
  },
};
