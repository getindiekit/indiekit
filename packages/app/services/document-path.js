import fs from 'fs';
import path from 'path';

/**
 * @param {string} urlpath URL path
 * @param {string} ext File extension
 * @returns {string} Path to file on disk
 */
export default (urlpath, ext = 'md') => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  ext = ext.replace('.', '');

  // Get equivalent file path
  const filepath = path.join(__dirname, '..', urlpath);

  // File with extension if exists, else folder index
  // path/to/file/index.md
  // path/to/file.md
  const document = fs.existsSync(filepath) ?
    path.join(filepath, `index.${ext}`) :
    `${filepath}.${ext}`;

  return document;
};
