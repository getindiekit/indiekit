import sharp from "sharp";
import { getMediaType } from "./file.js";

/**
 * Apply media transformation
 * @param {object} publication - Publication configuration
 * @param {object} file - File
 * @returns {Promise<object>} Media file
 */
export const mediaTransform = async (publication, file) => {
  const { postTypes } = publication;

  const type = await getMediaType(file);

  const typeConfig = postTypes[type];

  const { resize } = typeConfig.media;

  file.data = await sharp(file.data).resize(resize).toBuffer();

  return file;
};
