import fs from 'fs';
import path from 'path';
import {__dirname} from '../../index.js';

/**
 * @param {string} filename Fixture’s file name
 * @returns {Promise|object} File contents
 */
export default function (filename) {
  const file = path.resolve(__dirname, `tests/fixtures/${filename}`);
  return fs.readFileSync(file, 'utf-8');
}
