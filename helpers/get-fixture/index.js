import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

/**
 * @param {string} filename Fixture’s file name
 * @param {string} encoding String encoding
 * @returns {Promise|object} File contents
 */
export const getFixture = (filename, encoding = 'utf-8') => {
  const file = fileURLToPath(new URL(`../../fixtures/${filename}`, import.meta.url));
  return fs.readFileSync(file, {encoding});
};
