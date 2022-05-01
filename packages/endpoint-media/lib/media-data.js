import HttpError from "http-errors";
import { getPermalink, getPostTypeConfig, renderPath } from "./utils.js";
import { getFileProperties, getMediaType } from "./file.js";

export const mediaData = {
  /**
   * Create media data
   *
   * @param {object} publication Publication configuration
   * @param {object} file File
   * @returns {object} Media data
   */
  async create(publication, file) {
    try {
      if (!publication) {
        throw new Error("No publication configuration provided");
      }

      if (!file || file.truncated || !file.buffer) {
        throw new Error("No file included in request");
      }

      const { me, postTypes, timeZone } = publication;

      // Media properties
      const properties = await getFileProperties(publication, file);

      // Get post type configuration
      const type = await getMediaType(file);
      properties["post-type"] = type;

      // Throw error if trying to post unsupported media
      const supportedMediaTypes = ["audio", "photo", "video"];
      if (!supportedMediaTypes.includes(type)) {
        throw new HttpError(
          501,
          `Micropub does not support the ${type} media type.`
        );
      }

      // Get post type configuration
      const typeConfig = getPostTypeConfig(type, postTypes);
      if (!typeConfig) {
        throw new HttpError(
          501,
          `No configuration found for ${type} post type. See https://getindiekit.com/customisation/post-types/`
        );
      }

      // Media paths
      const path = renderPath(typeConfig.media.path, properties, timeZone);
      const url = renderPath(
        typeConfig.media.url || typeConfig.media.path,
        properties,
        timeZone
      );
      properties.url = getPermalink(me, url);

      // Update media properties based on type configuration
      const urlPathSegment = properties.url.split("/");
      properties.filename = urlPathSegment[urlPathSegment.length - 1];
      properties.basename = properties.filename.split(".")[0];

      // Media data
      const mediaData = { path, properties };
      return mediaData;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },

  /**
   * Read media data
   *
   * @param {object} publication Publication configuration
   * @param {string} url URL of uploaded media
   * @returns {object} Media data
   */
  async read(publication, url) {
    try {
      if (!publication) {
        throw new Error("No publication configuration provided");
      }

      if (!url) {
        throw new Error("No URL provided");
      }

      const { media } = publication;
      const file = await media.findOne({
        "properties.url": url,
      });
      return file;
    } catch (error) {
      throw new HttpError(400, error);
    }
  },
};
