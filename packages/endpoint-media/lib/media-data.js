import { IndiekitError } from "@indiekit/error";
import { getPermalink, getPostTypeConfig, renderPath } from "./utils.js";
import { getFileProperties, getMediaType } from "./file.js";

export const mediaData = {
  /**
   * Create media data
   * @param {object} publication - Publication configuration
   * @param {object} file - File
   * @returns {Promise<object>} Media data
   */
  async create(publication, file) {
    const { me, media, postTypes } = publication;

    // Media properties
    const properties = await getFileProperties(publication, file);

    // Get post type configuration
    const type = await getMediaType(file);
    properties["post-type"] = type;

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
    const path = renderPath(typeConfig.media.path, properties, publication);
    const url = renderPath(
      typeConfig.media.url || typeConfig.media.path,
      properties,
      publication
    );
    properties.url = getPermalink(me, url);

    // Update media properties based on type configuration
    const urlPathSegment = properties.url.split("/");
    properties.filename = urlPathSegment[urlPathSegment.length - 1];
    properties.basename = properties.filename.split(".")[0];

    // Add data to media collection
    const mediaData = { path, properties };
    await media.insertOne(mediaData);

    return mediaData;
  },

  /**
   * Read media data
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing media
   * @returns {Promise<object>} Media data
   */
  async read(publication, url) {
    const { media } = publication;
    const query = { "properties.url": url };

    const mediaData = await media.findOne(query);
    if (!mediaData) {
      throw IndiekitError.notFound(url);
    }

    return mediaData;
  },

  /**
   * Delete media data
   * @param {object} publication - Publication configuration
   * @param {string} url - URL of existing post
   * @returns {Promise<boolean>} Media data deleted
   */
  async delete(publication, url) {
    const { media } = publication;
    const query = { "properties.url": url };

    const result = await media.deleteOne(query);
    if (result?.deletedCount === 1) {
      return true;
    }

    throw new Error("No media data to delete");
  },
};
