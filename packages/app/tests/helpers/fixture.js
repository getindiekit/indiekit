import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

/**
 * @param {string} filename Fixture’s file name
 * @returns {Promise|object} File contents
 */
export default function (filename) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const file = path.resolve(__dirname, `../fixtures/${filename}`);
  return fs.readFileSync(file, 'utf-8');
}
