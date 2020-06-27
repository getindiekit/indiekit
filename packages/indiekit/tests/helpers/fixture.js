import fs from 'fs';
import path from 'path';
import {__dirname} from '../../index.js';

/**
 * @param {string} filename Fixture’s file name
 * @param {string} encoding String encoding
 * @returns {Promise|object} File contents
 */
export const getFixture = (filename, encoding = 'utf-8') => {
  const file = path.resolve(__dirname, `tests/fixtures/${filename}`);
  return fs.readFileSync(file, {encoding});
};
