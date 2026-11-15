import fs from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * @overload
 * @param {string} filename - Fixture’s file name
 * @param {true} [isUtf8] - Encoding fixture as UTF8
 * @returns {string} File contents
 */

/**
 * @overload
 * @param {string} filename - Fixture’s file name
 * @param {false} isUtf8 - Encoding fixture as UTF8
 * @returns {Buffer} File contents
 */

/**
 * Get fixture file contents
 * @param {string} filename - Fixture’s file name
 * @param {boolean} [isUtf8] - Encoding fixture as UTF8
 * @returns {string|Buffer} File contents
 */
export const getFixture = (filename, isUtf8 = true) => {
  const file = fileURLToPath(new URL(filename, import.meta.url));

  return fs.readFileSync(file, {
    ...(isUtf8 && { encoding: "utf8" }),
  });
};
