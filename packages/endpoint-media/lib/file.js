import { getDate } from "@indiekit/util";
import { fileTypeFromBuffer } from "file-type";

/**
 * Derive properties from file data
 * @param {object} timeZone - Application time zone
 * @param {object} file - Original file object
 * @returns {Promise<object>} File properties
 * @example fileData('brighton-pier.jpg') => {
 *   ext: '.jpg'
 *   filename: 'brighton-pier.jpg',
 *   'content-type': image/jpeg,
 *   published: '2020-07-19T22:59:23.497Z',
 * }
 */
export const getFileProperties = async (timeZone, file) => {
  const { ext } = await fileTypeFromBuffer(file.data);
  const published = getPublishedProperty(timeZone);

  return {
    "content-type": file.mimetype,
    ext,
    filename: file.name,
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
