import fs from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * @param {string} filename - Fixture’s file name
 * @param {globalThis.NodeJS.BufferEncoding} encoding - String encoding
 * @returns {object} File contents
 */
export const getFixture = (filename, encoding = "utf8") => {
  const file = fileURLToPath(new URL(filename, import.meta.url));
  return fs.readFileSync(file, { encoding });
};
