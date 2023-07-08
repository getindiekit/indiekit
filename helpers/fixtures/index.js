import fs from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * @param {string} filename - Fixture’s file name
 * @param {boolean} utf8 - Encoding fixture as UTF8
 * @returns {object} File contents
 */
export const getFixture = (filename, utf8 = true) => {
  const file = fileURLToPath(new URL(filename, import.meta.url));
  return fs.readFileSync(file, {
    ...(utf8 && { encoding: "utf8" }),
  });
};
