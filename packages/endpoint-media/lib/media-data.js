import { IndiekitError } from "@indiekit/error";
import { getPermalink, getPostTypeConfig, renderPath } from "./utils.js";
import { getFileProperties, getMediaType } from "./file.js";

export const mediaData = {
  /**
   * Create media data
   *
   * @param {object} publication - Publication configuration
   * @param {object} file - File
   * @returns {object} Media data
   */
  async create(publication, file) {
    const { me, postTypes } = publication;

    // Media properties
    const properties = await getFileProperties(publication, file);

    // Get post type configuration
    const type = await getMediaType(file);
    properties["post-type"] = type;

    // Throw error if trying to post unsupported media
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

    // Media data
    const mediaData = { path, properties };
    return mediaData;
  },
};
