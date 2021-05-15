import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} filename Fixture’s file name
 * @param {string} encoding String encoding
 * @returns {Promise|object} File contents
 */
export const getFixture = (filename, encoding = 'utf-8') => {
  const file = path.resolve(__dirname, `../../fixtures/${filename}`);
  return fs.readFileSync(file, {encoding});
};
