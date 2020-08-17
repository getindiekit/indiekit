import FileType from 'file-type';
import {randomString} from './utils.js';

/**
 * Derive properties from file data
 *
 * @param {object} file Original file object
 * @returns {object} File properties
 * @example fileData('brighton-pier.jpg') => {
 *   basename: 'ds48s',
 *   ext: '.jpg'
 *   filename: 'ds48s.jpg'
 *   originalname: 'flower.jpg',
 *   'mime-type': image/jpeg,
 *   published: '2020-07-19T22:59:23.497Z',
 * }
 */
export const getFileProperties = async file => {
  const basename = randomString();
  const {ext, mime} = await FileType.fromBuffer(file.buffer);
  const published = new Date().toISOString();

  return {
    basename,
    ext,
    filename: `${basename}.${ext}`,
    originalname: file.originalname,
    'mime-type': mime,
    published
  };
};

/**
 * Derive media type (and return equivalent IndieWeb post type)
 *
 * @param {object} file File object
 * @returns {string} Post type ('photo', 'video' or 'audio')
 * @example getMediaType('brighton-pier.jpg') => 'photo'
 */
export const getMediaType = async file => {
  const {mime} = await FileType.fromBuffer(file.buffer);

  if (mime.includes('audio/')) {
    return 'audio';
  }

  if (mime.includes('image/')) {
    return 'photo';
  }

  if (mime.includes('video/')) {
    return 'video';
  }

  return null;
};
