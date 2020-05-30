import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

/**
 * @param {string} urlpath URL path
 * @param {string} extension File extension
 * @returns {string} Path to file on disk
 */
export default (urlpath, extension = 'md') => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  extension = extension.replace('.', '');

  // Get equivalent file path
  const filepath = path.join(__dirname, '..', urlpath);

  // File with extension if exists, else folder index
  // - path/to/file/index.md
  // - path/to/file.md
  const document = fs.existsSync(filepath) ?
    path.join(filepath, `index.${extension}`) :
    `${filepath}.${extension}`;

  return document;
};
