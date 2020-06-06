import fs from 'fs';
import path from 'path';
import {__dirname} from '../index.js';

/**
 * @param {string} urlpath URL path
 * @param {string} extension File extension
 * @returns {string} Path to file on disk
 */
export const documentPath = (urlpath, extension = 'md') => {
  extension = extension.replace('.', '');

  // Get equivalent file path
  const filepath = path.join(__dirname, urlpath);

  // File with extension if exists, else folder index
  // - path/to/file/index.md
  // - path/to/file.md
  const documentPath = fs.existsSync(filepath) ?
    path.join(filepath, `index.${extension}`) :
    `${filepath}.${extension}`;

  return documentPath;
};
