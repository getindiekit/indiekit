import { fileTypeFromBuffer } from "file-type";
import { getDate } from "./date.js";
import { randomString } from "./utils.js";

/**
 * Derive properties from file data
 * @param {object} publication - Publication configuration
 * @param {object} file - Original file object
 * @returns {Promise<object>} File properties
 * @example fileData('brighton-pier.jpg') => {
 *   basename: 'ds48s',
 *   ext: '.jpg'
 *   filename: 'ds48s.jpg'
 *   originalname: 'brighton-pier.jpg',
 *   'content-type': image/jpeg,
 *   published: '2020-07-19T22:59:23.497Z',
 * }
 */
export const getFileProperties = async (publication, file) => {
  const { timeZone } = publication;

  const basename = randomString();
  const { ext } = await fileTypeFromBuffer(file.data);
  const published = getPublishedProperty(timeZone);

  return {
    basename,
    ext,
    filename: `${basename}.${ext}`,
    originalname: file.name,
    "content-type": file.mimetype,
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
