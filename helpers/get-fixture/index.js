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

/**
 * @param {string} filename Fixture’s file name
 * @returns {string} Fixture’s file path
 */
export const getFixturePath = filename =>
  fileURLToPath(new URL(`../../fixtures/${filename}`, import.meta.url));
