import FileType from 'file-type';
import path from 'path';
import {randomString} from '../utils.js';

/**
 * Derive properties from file data
 *
 * @param {object} file Original file object
 * @returns {object} File properties
 * @example fileData('brighton-pier.jpg') => {
 *   filename: 'ds48s',
 *   fileext: '.jpg'
 *   originalname: 'brighton-pier.jpg',
 *   uploaded: '2019-03-03T05:07:09+00:00',
 * }
 */
export const getFileProperties = async file => {
  const currentDate = new Date().toISOString();
  const randomBasename = randomString();
  const {ext} = await FileType.fromBuffer(file.buffer);

  return {
    filename: `${randomBasename}.${ext}`,
    fileext: ext,
    originalname: file.originalname,
    uploaded: currentDate
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

/**
 * Derive a permalink (by combining publication URL, that may
 * include a path, with the path to a post or file
 *
 * @param {object} url URL
 * @param {object} pathname Permalink path
 * @returns {string} Returns either 'photo', 'video' or audio
 * @example permalink('http://foo.bar/baz', '/qux/quux') =>
 *   'http://foo.bar/baz/qux/quux'
 */
export const getPermalink = (url, pathname) => {
  url = new URL(url);
  let permalink = path.join(url.pathname, pathname);
  permalink = new URL(permalink, url).href;

  return permalink;
};
