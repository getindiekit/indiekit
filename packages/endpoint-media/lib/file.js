import path from "node:path";
import { getDate, slugify } from "@indiekit/util";
import { fileTypeFromBuffer } from "file-type";

/**
 * Derive properties from file data
 * @param {object} publication - Publication configuration
 * @param {object} file - Original file object
 * @param {object} timeZone - Application time zone
 * @returns {Promise<object>} File properties
 * @example fileData('Brighton Pier.jpg') => {
 *   ext: '.jpg'
 *   filename: 'brighton-pier.jpg',
 *   'content-type': image/jpeg,
 *   published: '2020-07-19T22:59:23.497Z',
 * }
 */
export const getFileProperties = async (publication, file, timeZone) => {
  const { ext } = await fileTypeFromBuffer(file.data);
  const published = getPublishedProperty(timeZone);

  let basename = path.basename(file.name, path.extname(file.name));
  basename = slugify(basename, publication.slugSeparator);

  return {
    "content-type": file.mimetype,
    ext,
    filename: `${basename}.${ext}`,
    md5: file.md5,
    published,
  };
};

/**
 * Derive media type (and return equivalent IndieWeb post type)
 * @param {object} file - File object
 * @returns {Promise<string>} Post type ('photo', 'video' or 'audio')
 * @example getMediaType('brighton-pier.jpg') => 'photo'
 */
export const getMediaType = async (file) => {
  const { mime } = await fileTypeFromBuffer(file.data);
  const type = mime.split("/")[0];

  if (type === "image") {
    return "photo";
  }

  return type;
};

/**
 * Get published date
 * @param {object} timeZone - Publication time zone
 * @returns {string} ISO 8601 date
 */
export const getPublishedProperty = (timeZone) => {
  const dateString = new Date().toISOString();
  const property = getDate(timeZone, dateString);
  return property;
};
