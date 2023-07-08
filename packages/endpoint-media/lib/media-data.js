import { IndiekitError } from "@indiekit/error";
import { getCanonicalUrl } from "@indiekit/util";
import { getPostTypeConfig, renderPath } from "./utils.js";
import { getFileProperties, getMediaType } from "./file.js";

export const mediaData = {
  /**
   * Create media data
   * @param {object} application - Application configuration
   * @param {object} publication - Publication configuration
   * @param {object} file - File
   * @returns {Promise<object>} Media data
   */
  async create(application, publication, file) {
    const { hasDatabase, media, timeZone } = application;
    const { me, postTypes } = publication;

    // Media properties
    const properties = await getFileProperties(timeZone, file);

    // Get post type configuration
    const type = await getMediaType(file);
    properties["media-type"] = type;

    // Throw error if trying to create unsupported media
    const supportedMediaTypes = ["audio", "photo", "video"];
    if (!supportedMediaTypes.includes(type)) {
      throw IndiekitError.unsupportedMediaType(type);
    }

    // Get post type configuration
    const typeConfig = getPostTypeConfig(type, postTypes);
    if (!typeConfig) {
      throw IndiekitError.notImplemented(type);
    }

    // Media paths
    const path = await renderPath(
      typeConfig.media.path,
      properties,
      application
    );
    const url = await renderPath(
      typeConfig.media.url || typeConfig.media.path,
      properties,
      application
    );
    properties.url = getCanonicalUrl(url, me);

    // Update media properties based on type configuration
    const urlPathSegment = properties.url.split("/");
    properties.filename = urlPathSegment.at(-1);
    properties.basename = properties.filename.split(".")[0];

    const mediaData = { path, properties };

    // Add data to media collection (if present)
    if (hasDatabase) {
      await media.insertOne(mediaData);
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
    const { media } = application;
    const query = { "properties.url": url };

    const mediaData = await media.findOne(query);
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
    const { media } = application;
    const query = { "properties.url": url };

    const result = await media.deleteOne(query);
    if (result?.deletedCount === 1) {
      return true;
    }

    throw new Error("No media data to delete");
  },
};
